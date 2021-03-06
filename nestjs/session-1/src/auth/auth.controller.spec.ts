import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExpressSessions } from '../entities/expressSessions.entity';
import { UserAccount } from '../entities/userAccount.entity';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './common/auth.guard';
// import { CanActivate, ExecutionContext } from '@nestjs/common';
// https://docs.nestjs.com/migration-guide
// import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcrypt';
import * as httpMocks from 'node-mocks-http';

const mockUsersRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockSessionsRepository = () => ({});

// const mockAuthGuard: CanActivate = {
//   canActivate: (context: ExecutionContext) => {
//     const request = context.switchToHttp().getRequest();
//     console.log('here');
//     return request.user;
//   },
// };

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userAccountRepository: MockRepository<UserAccount>;
  let sessionsRepository: MockRepository<ExpressSessions>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserAccount),
          useValue: mockUsersRepository(),
        },
        {
          provide: getRepositoryToken(ExpressSessions),
          useValue: mockSessionsRepository(),
        },
      ],
    })
      // https://lahuman.jabsiri.co.kr/353
      // .overrideGuard(AuthGuard)
      // .useValue(mockAuthGuard)
      .compile();

    // httpService = module.get<HttpService>(HttpService);
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userAccountRepository = module.get<MockRepository<UserAccount>>(
      getRepositoryToken(UserAccount),
    );
    sessionsRepository = module.get<MockRepository<ExpressSessions>>(
      getRepositoryToken(ExpressSessions),
    );
  });

  // it('should be defined', () => {
  //   expect(httpService).toBeDefined();
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(userAccountRepository).toBeDefined();
  });

  it('should be defined', () => {
    expect(sessionsRepository).toBeDefined();
  });

  describe('signUp', () => {
    it('should create new user', async () => {
      const inputData = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      userAccountRepository.findOne.mockResolvedValue([null, false]);
      userAccountRepository.save.mockResolvedValue(inputData);

      const result = await controller.signUp(inputData);
      expect(result).toEqual('?????? ????????? ??????????????????');
    });
  });

  describe('signIn', () => {
    it('should singIn', async () => {
      const request = httpMocks.createRequest({
        session: {
          isAuthenticated: false,
          userID: 'bill@ms.com',
        },
      });

      const email = 'bill@ms.com';
      const password = 'Abcde12345!';
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const userInputData = {
        email: 'bill@ms.com',
        password: 'Abcde12345!',
      };

      const mockData = {
        email: email,
        password: hashedPassword,
      };

      userAccountRepository.findOne.mockResolvedValue(mockData);
      const result = await service.signIn(request, userInputData);
      expect(result).toEqual(true);
    });
  });

  // https://stackoverflow.com/questions/59767377/how-can-i-unit-test-that-a-guard-is-applied-on-a-controller-in-nestjs
  // auth guard ??? ??????????????? ????????? auth guard ???????????? controller ??????????????? ??????????????? ???????????? ?????????
  // auth guard ??? ?????? ????????? ????????? ?????? ??? ??????
  // controller ?????? auth guard ??? ???????????? ?????? http request ??? ???????????? ?????????
  // ?????? ???????????? axios ??? ?????? http request ??? ??? ??? ?????? ????????? ?????? ???????????? ??????????????? ?????????
  // ????????? ??????????????? ?????? ???????????? ????????? ?????? ??????
  // ???????????? ?????? ?????? ?????? ?????? ???????????? ????????? ????????????
  describe('guardTest', () => {
    it('should get instance of AuthGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AuthController.prototype.guardTest,
      );

      const guard = new guards[0]();
      expect(guard).toBeInstanceOf(AuthGuard);
    });
  });
});
