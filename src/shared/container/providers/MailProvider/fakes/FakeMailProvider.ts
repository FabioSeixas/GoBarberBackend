import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface Mail {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private sentEmails: Mail[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.sentEmails.push({ to, body });
  }
}
