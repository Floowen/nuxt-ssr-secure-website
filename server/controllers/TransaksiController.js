<?php
// app/Http/Controllers/TransaksiController.php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\Ulasan;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index(Request $request)
    {
        $query = Transaksi::with('user');

        if ($request->has('search') && $request->search != "") {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('user', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        if ($request->has('status') && $request->status != "") {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from != "") {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to != "") {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transaksis = $query->orderBy('created_at', 'desc')->paginate(10);

        return view('transaksi.index', compact('transaksis'));
    }

    public function show(Transaksi $transaksi)
    {
        // $transaksi->load(['user', 'detailTransaksis.produk']);
        $transaksi = Transaksi::with(['detailTransaksis.produk', 'ulasan', 'user', 'produk'])->findOrFail($transaksi->id);
        return view('transaksi.show', compact('transaksi'));
    }

    public function create()
    {
        // Implementasi untuk membuat transaksi baru
        return view('transaksi.create');
    }

    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'produk' => 'required|array',
            'produk.*.id' => 'required|exists:produks,id',
            'produk.*.jumlah' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $transaksi = Transaksi::create([
                'user_id' => $validated['user_id'],
                'status' => 'pending',
                'total' => 0,
            ]);

            $total = 0;
            foreach ($validated['produk'] as $produkData) {
                $produk = Produk::findOrFail($produkData['id']);
                $subtotal = $produk->harga * $produkData['jumlah'];
                $total += $subtotal;

                $transaksi->detailTransaksis()->create([
                    'produk_id' => $produk->id,
                    'jumlah' => $produkData['jumlah'],
                    'harga' => $produk->harga,
                ]);
            }

            $transaksi->update(['total' => $total]);

            DB::commit();

            return redirect()->route('transaksi.show', $transaksi)->with('success', 'Transaksi berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->withErrors(['error' => 'Terjadi kesalahan saat membuat transaksi. Silakan coba lagi.']);
        }
    }

    public function update(Request $request, Transaksi $transaksi)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,selesai,batal',
        ]);

        $transaksi->update($validated);

        return redirect()->route('transaksi.show', $transaksi)->with('success', 'Status transaksi berhasil diperbarui.');
    }

    public function destroy(Transaksi $transaksi)
    {
        if ($transaksi->status !== 'pending') {
            return back()->withErrors(['error' => 'Hanya transaksi dengan status pending yang dapat dihapus.']);
        }

        DB::beginTransaction();

        try {
            $transaksi->detailTransaksis()->delete();
            $transaksi->delete();

            DB::commit();

            return redirect()->route('transaksi.index')->with('success', 'Transaksi berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus transaksi. Silakan coba lagi.']);
        }
    }

    // ROLE PEMBELI
    public function ulasan(Request $request, Transaksi $transaksi)
    {
        // Pastikan hanya pembeli yang bisa memberikan ulasan
        if (Auth::id() !== $transaksi->user_id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk memberikan ulasan pada transaksi ini.');
        }

        // Validasi input
        $validatedData = $request->validate([
            'rating.*' => 'required|integer|min:1|max:5',
            'komentar.*' => 'required|string|max:1000',
        ]);

        // Cek apakah ulasan sudah ada
        // if ($transaksi->ulasans()->count() > 0) {
        //     return redirect()->back()->with('error', 'Anda sudah memberikan ulasan untuk transaksi ini.');
        // }

        // Buat ulasan untuk setiap produk dalam transaksi
        foreach ($transaksi->detailTransaksis as $index => $detail) {
            $ulasan = new Ulasan([
                'user_id' => Auth::id(),
                'transaksi_id' => $transaksi->id,
                'produk_id' => $detail->produk_id,
                'rating' => $validatedData['rating'][$index],
                'komentar' => $validatedData['komentar'][$index],
                'tanggal_ulasan' => now(),
            ]);

            $ulasan->save();
        }

        return redirect()->route('transaksi.detail', $transaksi->id)->with('success', 'Ulasan berhasil ditambahkan untuk semua produk.');
    }

    public function detail(Transaksi $transaksi)
    {
        if (Auth::id() !== $transaksi->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $transaksi = Transaksi::with(['detailTransaksis.produk', 'ulasan', 'user', 'produk'])->findOrFail($transaksi->id);

        // $transaksi->load(['user', 'detailTransaksis.produk']);
        return view('transaksi.show', compact('transaksi'));
    }

    public function list(Request $request)
    {
        $query = Transaksi::with('user')->where('user_id', Auth::id());

        if ($request->has('search') && $request->search != "") {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                    ->orWhereHas('user', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
        }

        if ($request->has('status') && $request->status != "") {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from != "") {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to != "") {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transaksis = $query->orderBy('created_at', 'desc')->paginate(10);

        return view('transaksi.index', compact('transaksis'));
    }
}
