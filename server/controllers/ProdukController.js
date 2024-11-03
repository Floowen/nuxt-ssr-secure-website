<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Stok;
use App\Models\Transaksi;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProdukController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function index(Request $request)
    {
        $query = Produk::with(['kategori', 'stoks']);
        $kategoris = Kategori::all();

        if ($request->has('search') && $request->search != "") {
            $searchTerm = $request->search;
            $query->where('nama', 'LIKE', "%{$searchTerm}%")
                ->orWhere('deskripsi', 'LIKE', "%{$searchTerm}%");
        }

        if ($request->has('kategori') && $request->kategori != "") {
            $query->where('kategori_id', $request->kategori);
        }

        if ($request->has('min_harga') && $request->min_harga != "") {
            $query->where('harga', '>=', $request->min_harga);
        }

        if ($request->has('max_harga') && $request->max_harga != "") {
            $query->where('harga', '<=', $request->max_harga);
        }

        $produks = $query->paginate(10);
        $filtered = false;

        return view('produk.index', compact('produks', 'kategoris', 'filtered'));
    }

    public function create()
    {
        $kategoris = Kategori::all();
        return view('produk.create', compact('kategoris'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'deskripsi' => 'nullable',
            'harga' => 'required|numeric',
            'kategori_id' => 'required|exists:kategoris,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            //$produk = Produk::create($request->all());

            $data = $request->all();

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('produk_images', 'public');
                $data['image'] = $imagePath;
            }

            $produk = Produk::create($data);

            // Hanya membuat entri dasar di tabel stok
            Stok::create([
                'produk_id' => $produk->id,
                'jumlah' => 0, // Jumlah awal 0
                'lokasi_penyimpanan' => 'Belum ditentukan',
                'tanggal_kadaluarsa' => now()->addYear(), // Tanggal default 1 tahun dari sekarang
                'batch_number' => 'BATCH-' . $produk->id, // Batch number awal
            ]);

            DB::commit();
            return redirect()->route('produk.index')->with('success', 'Produk berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menambahkan produk.');
        }
    }

    public function show(Produk $produk)
    {
        $produk->load(['stoks', 'ulasans.user']);
        return view('produk.show', compact('produk'));
    }

    public function edit(Produk $produk)
    {
        $kategoris = Kategori::all();
        return view('produk.edit', compact('produk', 'kategoris'));
    }

    public function update(Request $request, Produk $produk)
    {
        $validated = $request->validate([
            'nama' => 'required|max:255',
            'deskripsi' => 'nullable',
            'harga' => 'required|numeric|min:0',
            'kategori_id' => 'required|exists:kategoris,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Delete old image
            if ($produk->image) {
                Storage::disk('public')->delete($produk->image);
            }

            $imagePath = $request->file('image')->store('produk_images', 'public');
            $data['image'] = $imagePath;
        }

        $produk->update($data);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Produk $produk)
    {
        DB::beginTransaction();

        try {
            // Hapus ulasan terkait produk
            $produk->ulasans()->delete();

            // Hapus detail transaksi terkait produk
            $detailTransaksis = DetailTransaksi::where('produk_id', $produk->id)->get();
            foreach ($detailTransaksis as $detail) {
                $transaksiId = $detail->transaksi_id;
                $detail->delete();

                // Cek apakah transaksi masih memiliki detail lain
                if (DetailTransaksi::where('transaksi_id', $transaksiId)->count() == 0) {
                    // Jika tidak ada detail lain, hapus transaksi
                    Transaksi::destroy($transaksiId);
                } else {
                    // Jika masih ada detail lain, update total transaksi
                    $transaksi = Transaksi::find($transaksiId);
                    $transaksi->total = $transaksi->detailTransaksis->sum(function ($detail) {
                        return $detail->harga * $detail->jumlah;
                    });
                    $transaksi->save();
                }
            }

            // Hapus stok terkait produk
            $produk->stoks()->delete();

            if ($produk->image) {
                Storage::disk('public')->delete($produk->image);
            }

            // Hapus produk
            $produk->delete();

            DB::commit();
            return redirect()->route('produk.index')->with('success', 'Produk dan semua data terkait berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus produk: ' . $e->getMessage());
        }
    }

    // ROLE PEMBELI
    public function filter(Request $request)
    {
        $query = Produk::with(['kategori', 'stoks']);
        $kategoris = Kategori::all();

        if ($request->has('search') && $request->search != "") {
            $searchTerm = $request->search;
            $query->where('nama', 'LIKE', "%{$searchTerm}%")
                ->orWhere('deskripsi', 'LIKE', "%{$searchTerm}%");
        }

        if ($request->has('kategori') && $request->kategori != "") {
            $query->where('kategori_id', $request->kategori);
        }

        if ($request->has('min_harga') && $request->min_harga != "") {
            $query->where('harga', '>=', $request->min_harga);
        }

        if ($request->has('max_harga') && $request->max_harga != "") {
            $query->where('harga', '<=', $request->max_harga);
        }

        $produks = $query->paginate(10);
        $filtered = true;

        return view('produk.list', compact('produks', 'kategoris', 'filtered'));
    }

    public function list(Request $request)
    {
        $query = Produk::with(['kategori', 'stoks']);
        $kategoris = Kategori::all();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('nama', 'LIKE', "%{$searchTerm}%")
                ->orWhere('deskripsi', 'LIKE', "%{$searchTerm}%");
        }

        if ($request->has('kategori')) {
            $query->where('kategori_id', $request->kategori);
        }

        if ($request->has('min_harga')) {
            $query->where('harga', '>=', $request->min_harga);
        }

        if ($request->has('max_harga')) {
            $query->where('harga', '<=', $request->max_harga);
        }

        $produks = $query->paginate(10);
        $filtered = false;

        return view('produk.list', compact('produks', 'kategoris', 'filtered'));
    }
}
