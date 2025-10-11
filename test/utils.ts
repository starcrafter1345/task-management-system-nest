import { PrismaService } from "../src/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

export const settingUpApp = async (
  prisma: PrismaService,
): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  await prisma.user.deleteMany();
  await prisma.course.deleteMany();

  return app;
};
