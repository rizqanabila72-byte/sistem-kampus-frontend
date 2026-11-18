export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  program_studi_id: number;
  email: string;
  nomor_hp: string;
  jenis_kelamin: number | boolean; // 1 = Laki-laki, 0 = Perempuan
  tempat_lahir: string;
  tanggal_lahir: string;
  golongan_darah: string | null;
}

export interface ProgramStudi {
  id: number;
  program_studi: string;
}