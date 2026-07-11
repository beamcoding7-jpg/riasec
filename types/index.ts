// Shared types — re-export generated DB types + alias ที่ใช้บ่อย (import จาก "@/types")
import type { Tables, Enums, Database } from "@/types/database";

export type { Database };

// มิติ RIASEC (R/I/A/S/E/C)
export type RiasecDimension = Enums<"riasec_dimension">;

// Row aliases — ใช้แทน Tables<"..."> ให้อ่านง่ายในโค้ดฟีเจอร์
export type Question = Tables<"riasec_questions">;
export type TestSession = Tables<"test_sessions">;
export type StudyTrack = Tables<"study_tracks">;
export type Career = Tables<"careers">;
export type University = Tables<"universities">;
export type Faculty = Tables<"faculties">;
export type Major = Tables<"majors">;
export type TrackMap = Tables<"riasec_track_map">;
export type CareerMap = Tables<"riasec_career_map">;
export type MajorMap = Tables<"riasec_major_map">;
