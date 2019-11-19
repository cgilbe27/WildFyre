import { WildFyrePage } from './app.po';

describe('wild-fyre App', () => {
  let page: WildFyrePage;

  beforeEach(() => {
    page = new WildFyrePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
