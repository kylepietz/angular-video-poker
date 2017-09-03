import { VideoPokerPage } from './app.po';

describe('video-poker App', () => {
  let page: VideoPokerPage;

  beforeEach(() => {
    page = new VideoPokerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
