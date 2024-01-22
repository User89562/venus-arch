import { HydrusRating } from "../ratings/hydrus-rating";

export interface FileSearchAPI {
  file_ids: number[];
  hashes: string[];
}

export interface HydrusMetadata {
  metadata: HydrusFile[];
}

export interface HydrusFileAPI {
  fileSize: number;
}

export interface HydrusFile {
  file_id: number;
  hash: string;
  size: number;
  mime: string;
  ext: string;
  width: number;
  height: number;
  has_audio: boolean;
  known_urls: string[];
  duration?: number | null;
  num_frames?: number | null;
  num_words?: number | null;
  is_inbox: boolean;
  is_local: boolean;
  is_trashed: boolean;
  file_url?: string;
  thumbnail_url?: string;
  file_type?: HydrusFileType;
  has_thumbnail?: boolean;
  ratings?: HydrusRating[];
}

export enum HydrusFileType {
  Image,
  Video,
  Audio,
  Flash,
  Unsupported,
}

export class UserFiles {
  constructor() {
    this.archive = [];
    this.skipped = [];
    this.delete = [];
  }
  archive: HydrusFile[];
  skipped: HydrusFile[];
  delete: HydrusFile[];
}

export class RatingFileChanges {
  constructor(
    public hash: string,
    public rating_service_key: string,
    public rating: any
  ) {}
}

export class HydrusFileId {
  constructor(public file_id: number) {}
}

export class HydrusFileIds {
  constructor(public file_ids: number[]) {}
}

export interface Boned {
  boned_stats: BonedStats;
}

export interface BonedStats {
  num_inbox: number;
  num_archive: number;
  num_deleted: number;
  size_inbox: number;
  size_deleted: number;
  earliest_import_time: number;
  total_viewTime: number[];
  total_alternate_files: number;
  total_duplicate_files: number;
  total_potential_pairs: number;

}
