import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const { questions, ...quizData } = createQuizDto;

    try {
      const quiz = await (this.prisma.quiz as any).create({
        data: {
          lesson_id: quizData.lesson_id,
          total_points: quizData.total_points,
          is_timed: quizData.is_timed ?? false,
          time_limit_seconds: quizData.time_limit_seconds,
          questions: {
            create: questions.map((q: any) => ({
              question_text: q.question_text,
              points: q.points,
              options: {
                create: q.options.map((o: any) => ({
                  option_text: o.option_text,
                  is_correct: o.is_correct,
                })),
              },
            })),
          },
        },
        include: {
          questions: { include: { options: true } },
          lesson: { select: { title: true } },
        },
      });

      this.notificationsService.notifyAllAdmins({
        type: 'new_quiz',
        title: 'New Quiz Created',
        message: `A new quiz with ${quiz.questions.length} question${quiz.questions.length !== 1 ? 's' : ''} has been added to lesson "${quiz.lesson.title}".`,
      }).catch(() => {});

      return quiz;
    } catch (error: any) {
      console.error('DEBUG: Quiz creation failed with error:', error);
      if (error && error.code === 'P2002') {
        throw new ConflictException('A quiz for this lesson already exists.');
      }
      if (error && (error.code === 'P2025' || error.code === 'P2003')) {
        throw new NotFoundException('Lesson not found. Please provide a valid lesson_id.');
      }
      console.error('Quiz creation failed with unhandled error:', error);
      throw new InternalServerErrorException('An unexpected server error occurred while creating the quiz.');
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

  async findAllByLesson(lessonId: string) {
    const quizzes = await (this.prisma.quiz as any).findMany({
      where: { lesson_id: lessonId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return Promise.all(
      quizzes.map(async (quiz: any) => {
        const uniqueStudents = await (this.prisma.studentQuizAttempt as any).groupBy({
          by: ['student_id'],
          where: { quiz_id: quiz.quiz_id },
        });
        return { ...quiz, studentsTakenCount: uniqueStudents.length };
      }),
    );
  }

  async update(id: string, updateQuizDto: any) {
    const { questions, ...quizData } = updateQuizDto;
    
    if (questions) {
      // Recreate questions if provided
      // Delete options first to avoid foreign key constraint issues
      await (this.prisma.quizOption as any).deleteMany({
        where: { question: { quiz_id: id } }
      });
      
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
    const quiz = await (this.prisma.quiz as any).findUnique({
      where: { quiz_id: id }
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    await (this.prisma.studentQuizAttempt as any).deleteMany({ where: { quiz_id: id } });
    await (this.prisma.quizOption as any).deleteMany({
      where: { question: { quiz_id: id } }
    });
    await (this.prisma.quizQuestion as any).deleteMany({ where: { quiz_id: id } });
    return (this.prisma.quiz as any).delete({ where: { quiz_id: id } });
  }

  async findAll(options: { page?: number; limit?: number; lessonId?: string } = {}) {
    const { page = 1, limit = 10, lessonId } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (lessonId) {
      where.lesson_id = lessonId;
    }

    const [total, quizzes] = await Promise.all([
      (this.prisma.quiz as any).count({ where }),
      (this.prisma.quiz as any).findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          lesson: {
            created_at: 'desc',
          },
        },
        include: {
          lesson: {
            select: {
              title: true,
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
          questions: {
            include: {
              options: true,
            },
          },
        },
      }),
    ]);

    const results = await Promise.all(
      quizzes.map(async (quiz: any) => {
        const uniqueStudents = await (this.prisma.studentQuizAttempt as any).groupBy({
          by: ['student_id'],
          where: { quiz_id: quiz.quiz_id },
        });
        return { ...quiz, studentsTakenCount: uniqueStudents.length };
      }),
    );

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
