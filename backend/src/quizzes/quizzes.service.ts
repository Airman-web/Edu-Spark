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

  async findOne(id: string) {
    const quiz = await (this.prisma.quiz as any).findUnique({
      where: { quiz_id: id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (quiz) {
      const uniqueStudents = await (this.prisma.studentQuizAttempt as any).groupBy({
        by: ['student_id'],
        where: { quiz_id: quiz.quiz_id },
      });
      return { ...quiz, studentsTakenCount: uniqueStudents.length };
    }
    return null;
  }

  async findOneByLesson(lessonId: string) {
    const quiz = await (this.prisma.quiz as any).findFirst({
      where: { lesson_id: lessonId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (quiz) {
      const uniqueStudents = await (this.prisma.studentQuizAttempt as any).groupBy({
        by: ['student_id'],
        where: { quiz_id: quiz.quiz_id },
      });
      return { ...quiz, studentsTakenCount: uniqueStudents.length };
    }
    return null;
  }

  async update(id: string, updateQuizDto: any) {
    const { questions, ...quizData } = updateQuizDto;
    
    if (questions) {
      // Recreate questions if provided
      await (this.prisma.quizQuestion as any).deleteMany({
        where: { quiz_id: id }
      });
      
      return await (this.prisma.quiz as any).update({
        where: { quiz_id: id },
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
        include: { questions: { include: { options: true } } }
      });
    }

    return await (this.prisma.quiz as any).update({
      where: { quiz_id: id },
      data: quizData,
      include: { questions: { include: { options: true } } }
    });
  }

  async remove(id: string) {
    await (this.prisma.studentQuizAttempt as any).deleteMany({ where: { quiz_id: id } });
    await (this.prisma.quizOption as any).deleteMany({
      where: { question: { quiz_id: id } }
    });
    await (this.prisma.quizQuestion as any).deleteMany({ where: { quiz_id: id } });
    return (this.prisma.quiz as any).delete({ where: { quiz_id: id } });
  }
}
