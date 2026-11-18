
export const JABATAN = [
  "tenaga pengajar",
  "asisten ahli",
  "lektor",
  "lektor kepala",
  "guru besar",
] as const;

export const STATUS = [
  "aktif",
  "cuti",
  "ijin belajar",
  "tugas di instansi lain",
  "tugas belajar",
] as const;

export interface Dosen {
  id: number;
  nidn: string | null;
  nip: string | null;
  tmt: string | null;
  nama_lengkap: string;
  pangkat_id: number | null;
  jenis_kelamin: boolean | number;
  foto: string;
  kelompok_bidang_keahlian_id: number | null;
  bidang_keilmuan: string | null;
  jabatan_fungsional: (typeof JABATAN)[number];
  status: (typeof STATUS)[number];
  user_id: number | null;
  program_studi_id: number | null;
  created_at?: string;
  updated_at?: string;
}
