# 🚀 Tinjauan Kode & Pedoman Pengembangan (Update & Soft-Delete)

Dokumen ini merangkum hasil *Code Review* dari implementasi fungsionalitas `UPDATE` (Edit) dan `DELETE` (Penonaktifan) pada modul **Outlet, User Management, dan Tenant** sesuai dengan _Issue #7_. Dokumen ini disusun sebagai acuan kerja praktis (Low-Level Instruction) bagi Junior Programmer pada *sprint* berikutnya.

---

## 1. Temuan & Analisis Arsitektur Code

Kode yang baru diimplementasikan sudah solid, namun menekankan beberapa pilar arsitektur baru yang **harus dipatuhi** oleh setiap kontributor:

-   **Penghapusan Mutlak Berlaku *Cascading Soft-Delete***
    Tidak ada perintah memusnahkan data secara permanen (`.delete()`) untuk mempertahankan relasi *Foreign Key* dan integritas Laporan Audit. Fitur pemberhentian (Terminasi Perusahaan) akan memicu domino untuk melumpuhkan seluruh *user/employee* perusahaan (dilihat pada `delete-tenant.usecase.ts`).
-   **Klausul Anti-Suicide & Pembatasan Super-Privilege**
    Dalam layanan manajemen anggota, terdapat *guard* di mana seorang manajer tidak sengaja "menghapus akun miliknya sendiri" saat mereka masih *login* memegang kendali eksekusi. Posisi `Role.OWNER` direkayasa menjadi steril di dalam ekosistem pegawai (tidak bisa ditambah/diedit melalui gerbang karyawan publik).

---

## 2. 👨‍💻 Low-Level Instruction (Acuan Junior Programmer)

Kepada seluruh *Junior Programmer*, harap jadikan metodologi ini sebagai acuan tetap setiap kali membangun fitur `Update` dan `Delete` di entitas manapun ke depannya!

### a. Modul API Wajib Menggunakan Filter `deleted_at: null`
Saat Anda membuat rute untuk menampilkan himpunan data (`GET /list`), Anda harus memastikan rekor yang sudah "terhapus" (`deleted_at`) disembunyikan.

**✅ CONTOH WAJIB DI FUNGSI `GET` / FETCH:**
```typescript
const activeData = await this.prisma.outlet.findMany({
    where: {
        tenant_id: tenantId,
        deleted_at: null, // <--- Baris kode ini KRITIKAL!
    }
});
```

### b. Prosedur Mutakhir untuk Mengubah (UPDATE) Entri Multi-Tabel
Setiap ada rute atau manipulasi `UPDATE` yang menyertakan relasi silang, **Gunakan Prisma Transaction** untuk mencegah status menggantung. Anda harus menggunakan objek `tx`!

**✅ CONTOH IMPLEMENTASI UPDATE YANG BENAR:**
```typescript
const updatedUser = await this.prisma.$transaction(async (tx) => {
    // 1. Lakukan Perubahan pada Data Utama
    const user = await tx.user.update({
        where: { user_id: targetUserId },
        data: { name: dto.name, role: dto.role, updated_at: new Date() },
    });

    // 2. Rekam Jejak (Audit Logging) SECARA BERSAMAAN DALAM SATU TX
    await tx.auditLog.create({
        data: {
            tenant_id: tenantId,
            user_id: authorId,
            action: 'UPDATE',
            entity: 'User',
            entity_id: targetUserId,
            // Rekam bentuk lama (old_value) dan baru (new_value).
            old_value: { name: oldUser.name },
            new_value: { name: user.name },
        },
    });

    return user; // Berhasil tersimpan tanpa cacat.
});
```

### c. Prosedur Pemberhentian Paksa (Cascading Deactivation & Soft-Delete)
Ketika sebuah entitas inti tertutup/dicabut (seperti Tenant bangkrut), jangan lupakan entitas cabangnya (Outlet/Employee).

**✅ CONTOH IMPLEMENTASI DELETE (CASCADING):**
```typescript
const result = await this.prisma.$transaction(async (tx) => {
    // 1. Soft-Delete Entitas Induk (Tenant)
    await tx.tenant.update({
        where: { tenant_id: tenantId },
        data: { deleted_at: new Date() }, // <-- Injeksikan Penanda Timestamp
    });

    // 2. Lumpuhkan secara Massal (UpdateMany) pada Anak/Karyawan Cabang
    await tx.user.updateMany({
        where: { tenant_id: tenantId, deleted_at: null },
        data: { 
            is_active: false, // <-- Blokir akses login mereka
            deleted_at: new Date() 
        },
    });
});
```

### d. Validasi Eksklusif Entitas Master (Role.OWNER)
Jika fungsionalitas Anda melibatkan perubahan *Role* karyawan, **Haram hukumnya** menyertakan celah eskalasi otoritas (*Privilege Escalation*)!

```typescript
// Cegah Siapun Mendaulat Dirinya/Orang Lain Sebagai Pemilik Saham
if (dto.role === Role.OWNER) {
    throw new ForbiddenException('Cannot promote user to OWNER role');
}
```

---

## 3. Rekomendasi Kedepannya (Backlog Potensial)
-   **Kecerdasan Audit Log**: Model `AuditLog` akan tumbuh sangat besar dengan cepat, sebaiknya fitur pengambilan Audit Log (List Log) juga diberikan dukungan Pagination di *sprint* berikutnya.
-   **Password Reset**: Saat ini, `UpdateUserUseCase` menggunakan fungsi sederhana untuk menerima sandi dari *admin*. Idealnya nanti kita akan kembangkan "Reset / Invite Password by Email" untuk menghindari sandi *plaintext* disentuh admin.
