import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

// Mock nodemailer before importing MailService
const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendGuardianSessionAlert', () => {
    it('should send an email with the correct recipient and subject', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-1' });

      await service.sendGuardianSessionAlert(
        'jane@example.com',
        'Jane Doe',
        'John Doe',
        10,
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'jane@example.com',
          subject: expect.stringContaining('John Doe'),
          html: expect.stringContaining('Jane Doe'),
        }),
      );
    });

    it('should include the duration in the email body', async () => {
      mockSendMail.mockResolvedValue({});

      await service.sendGuardianSessionAlert(
        'jane@example.com',
        'Jane Doe',
        'John Doe',
        15,
      );

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('15');
      expect(callArgs.html).toContain('John Doe');
    });

    it('should not throw if sending fails (graceful error handling)', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP error'));

      await expect(
        service.sendGuardianSessionAlert('bad@email.com', 'Name', 'Child', 5),
      ).resolves.not.toThrow();
    });
  });
});
