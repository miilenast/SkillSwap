/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private supabase;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('SUPABASE_URL');
    const key = this.configService.get('SUPABASE_KEY');
    this.supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
    this.bucket = this.configService.get('SUPABASE_BUCKET') || 'uploads';
  }

  async uploadFile(
    userId: number | string,
    file: Express.Multer.File,
  ): Promise<{ path: string; urlfile: string }> {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    const keyfile = `profile-pictures/${userId}/profile_${Date.now()}.jpg`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(keyfile, file.buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Supabase upload failed: ${error.message}`,
      );
    }

    return {
      path: keyfile,
      urlfile: this.getPublicUrl(keyfile),
    };
  }

  getPublicUrl(path: string): string {
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${encodeURI(path)}`;
  }
}
