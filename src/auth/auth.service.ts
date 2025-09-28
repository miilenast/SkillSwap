/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import axios from 'axios';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AuthService {
  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: any): Promise<{ id: number }> {
    const existingUsername = await this.userService.findUserByUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      throw new Error('User already exists');
    }

    const existingEmail = await this.userService.findUserByEmail(
      createUserDto.email,
    );
    if (existingEmail) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (createUserDto.address) {
      try {
        const response = await axios.get(
          'https://nominatim.openstreetmap.org/search',
          {
            params: {
              q: createUserDto.address,
              format: 'json',
              limit: 1,
            },
            headers: { 'User-Agent': 'SkillSwap' },
          },
        );

        if (response.data && response.data.length > 0) {
          latitude = parseFloat(String(response.data[0].lat));
          longitude = parseFloat(String(response.data[0].lon));
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    }

    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
      firstName: createUserDto.firstName || '',
      lastName: createUserDto.lastName || '',
      phoneNumber: createUserDto.phoneNumber || '',
      address: createUserDto.address || '',
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    });

    return { id: user.id };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
