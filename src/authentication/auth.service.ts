import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { SignInDto, SignUpDto, AccountVerification } from './dto/auth.input';
import { JwtService } from '@nestjs/jwt';
import {
  isRoleValid,
  compareWithEncryptedText,
  encryptText,
  getRandomCode,
} from 'src/lib/helper/authHelper';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginData: SignInDto) {
    const user = await this.customerService.getCustomerByIdOrEmail(
      loginData.email,
    );
    if (!user) {
      throw new NotFoundException(
        'User is not registered. Please sign up to continue',
      );
    }
    const isPasswordSame = await compareWithEncryptedText(
      loginData.password,
      user.password,
    );
    if (!isPasswordSame) {
      throw new UnauthorizedException('Incorrect Password. Please try again.');
    }
    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signUp(payload: SignUpDto) {
    const user = await this.customerService.getCustomerByIdOrEmail(
      payload.email,
    );
    if (user) {
      throw new ConflictException(
        'User is already registered. Please sign in to continue',
      );
    }
    if (payload.role && !isRoleValid(payload.role)) {
      throw new BadRequestException(
        'Invalid role. Role can be either USER or ADMIN',
      );
    }
    const { password, ...data } = payload;

    const hashedPassword = await encryptText(password);
    const randomCode = getRandomCode().toString();
    console.log(randomCode);
    const activationCode = await encryptText(randomCode);
    const registeredUser = await this.customerService.createCustomer({
      ...data,
      password: hashedPassword,
      activationCode,
    });

    const tokens = await this.getTokens(registeredUser.id, registeredUser.role);
    await this.updateRefreshToken(registeredUser.id, tokens.refreshToken);
    return tokens;
  }

  async getUserProfile(userId: string) {
    const loggedUser = await this.customerService.getCustomerByIdOrEmail(
      userId,
    );
    return loggedUser;
  }

  async verifyAccount(data: AccountVerification) {
    const { id, code } = data;
    const user = await this.customerService.getCustomerByIdOrEmail(id);
    if (user.isVerified) {
      throw new BadRequestException(
        'Your account is already activated. Please login to continue',
      );
    }
    const isCodeCorrect = await compareWithEncryptedText(
      code,
      user.activationCode,
    );
    if (!isCodeCorrect) {
      throw new BadRequestException(
        'Incorrect activation code. Please try again',
      );
    }
    return await this.customerService.updateByIdOrEmail(id, {
      isVerified: true,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    if (!userId || !refreshToken) {
      throw new BadRequestException('Missing id or token');
    }
    const user = await this.customerService.getCustomerByIdOrEmail(userId);
    if (!user) {
      throw new BadRequestException('No such user');
    }
    const isRefreshTokenSame = await compareWithEncryptedText(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenSame) {
      throw new BadRequestException('Incorrect token');
    }
    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        role,
      }),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET_KEY,
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await encryptText(refreshToken);
    await this.customerService.updateByIdOrEmail(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
