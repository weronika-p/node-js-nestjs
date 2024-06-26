import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import rootDir from './util/path'
import { create } from 'express-handlebars'
import * as session from 'express-session'
import { auth } from './middleware/authentication.middleware'
import { ValidationPipe } from '@nestjs/common'
import { ValidationException } from './exceptions/validation.exception'
import * as favicon from 'serve-favicon'
import helmet from 'helmet'
import * as compression from 'compression'
import * as morgan from 'morgan'
import { createWriteStream } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const accessLogStream = createWriteStream(join(__dirname, 'access.log'), {
    flags: 'a',
  })
  app.use(helmet())
  app.use(compression())
  app.use(morgan('combined', { stream: accessLogStream }))
  app.useStaticAssets(join(rootDir, 'public'))
  app.useStaticAssets(join(rootDir, 'images'), { prefix: '/images' })
  app.setBaseViewsDir([
    join(rootDir, 'views'),
    join(rootDir, 'views/admin'),
    join(rootDir, 'views/shop'),
    join(rootDir, 'views/auth'),
  ])
  const hbs = create({
    extname: '.hbs',
    layoutsDir: join(rootDir, 'views/layouts'),
    partialsDir: join(rootDir, 'views/partials'),
  })
  app.engine('hbs', hbs.engine)
  app.setViewEngine('hbs')
  app.use(
    session({
      store: new (require('connect-pg-simple')(session))({
        conString: `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB_NAME}`,
      }),
      secret: process.env.POSTGRES_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(auth)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: errors => new ValidationException(errors),
    }),
  )
  app.use(favicon(join(rootDir, 'public', 'favicon.ico')))
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
