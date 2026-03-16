import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const { questions, ...quizData } = createQuizDto;

    try {
      return await (this.prisma.quiz as any).create({
        data: {
          ...quizData,
          questions: {
            create: questions.map((q) => ({
              question_text: q.question_text,
              points: q.points,
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('A quiz for this lesson already exists.');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Lesson not found.');
        }
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the quiz.');
    }
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
