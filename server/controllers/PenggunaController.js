<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class PenggunaController extends Controller
{
    public function index()
    {
        $users = User::paginate(10);
        return view('pengguna.index', compact('users'));
    }

    public function create()
    {
        $roles = Role::all();
        return view('pengguna.create', compact('roles'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'required|exists:roles,name',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $user->assignRole($validated['role']);

            return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil ditambahkan!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menambahkan pengguna. Silakan coba lagi.'])->withInput();
        }
    }

    public function edit(User $pengguna)
    {
        $roles = Role::all();
        return view('pengguna.edit', compact('pengguna', 'roles'));
    }

    public function update(Request $request, User $pengguna)
    {
        try {
            if ($request->password != "") {
                $forms = [
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users,email,' . $pengguna->id,
                    'role' => 'required|exists:roles,name',
                    'password' => 'string|min:8',
                ];
            } else {
                $forms = [
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users,email,' . $pengguna->id,
                    'role' => 'required|exists:roles,name',
                ];
            }

            $validated = $request->validate($forms);

            if ($request->password != "") {
                $pengguna->update([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                ]);
            } else {
                $pengguna->update([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                ]);
            }

            $pengguna->syncRoles([$validated['role']]);

            return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil diperbarui!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui pengguna. Silakan coba lagi.'])->withInput();
        }
    }

    public function destroy(User $pengguna)
    {
        try {
            $pengguna->delete();
            return redirect()->route('pengguna.index')->with('success', 'Pengguna berhasil dihapus!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.']);
        }
    }
}
