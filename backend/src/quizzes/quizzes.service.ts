import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const { questions, ...quizData } = createQuizDto;

    return (this.prisma.quiz as any).create({
      data: {
        ...quizData,
        questions: {
          create: questions.map((q) => ({
            question_text: q.question_text,
            options: {
              create: q.options.map((o) => ({
                option_text: o.option_text,
                is_correct: o.is_correct,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return (this.prisma.quiz as any).findUnique({
      where: { quiz_id: id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  findOneByLesson(lessonId: string) {
    return (this.prisma.quiz as any).findUnique({
      where: { lesson_id: lessonId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }
}
