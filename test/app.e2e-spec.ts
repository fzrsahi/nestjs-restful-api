import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src//auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    app.listen(5000);
    pactum.request.setBaseUrl('http://localhost:5000');
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    app.close();
  });

  describe('auth', () => {
    const dto: AuthDto = {
      email: 'fazrul.sahi@gmail.com',
      password: '123',
    };
    describe('signup', () => {
      it('it should error if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
      it('it should error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: '123',
          })
          .expectStatus(400)
          .inspect();
      });

      it('it should error if email not valid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'fazrulgmail.com',
            password: '123',
          })
          .expectStatus(400)
          .inspect();
      });

      it('it should error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'fazrul@gmail.com',
          })
          .expectStatus(400)
          .inspect();
      });

      it('it should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('signin', () => {
      it('it should error if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400)
          .inspect();
      });
      it('it should error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: '123',
          })
          .expectStatus(400)
          .inspect();
      });

      it('it should error if email not valid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'fazrulgmail.com',
            password: '123',
          })
          .expectStatus(400)
          .inspect();
      });

      it('it should error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'fazrul@gmail.com',
          })
          .expectStatus(400)
          .inspect();
      });

      it('it should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'token')
          .inspect();
      });
    });
  });

  describe('users', () => {
    describe('get me', () => {
      it('shoult return current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('edit user', () => {
      it('should edit current user login', () => {
        const dto: EditUserDto = {
          firstName: 'Vladimir',
          email: 'vlad@codewithvlad.com',
        };
        return pactum
          .spec()
          .patch('/user')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
          .inspect();
      });
    });
  });

  describe('bookmarks', () => {
    describe('create bookmark', () => {});
    describe('get all bookmarks', () => {});
    describe('get bookmark by id', () => {});
    describe('edit bookmark', () => {});
    describe('delete bookmark', () => {});
  });
});
