import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import {
  AppDocumentComponentsPage,
  /* AppDocumentDeleteDialog,
   */ AppDocumentUpdatePage
} from './app-document.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('AppDocument e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let appDocumentComponentsPage: AppDocumentComponentsPage;
  let appDocumentUpdatePage: AppDocumentUpdatePage;
  /* let appDocumentDeleteDialog: AppDocumentDeleteDialog; */
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load AppDocuments', async () => {
    await navBarPage.goToEntity('app-document');
    appDocumentComponentsPage = new AppDocumentComponentsPage();
    await browser.wait(ec.visibilityOf(appDocumentComponentsPage.title), 5000);
    expect(await appDocumentComponentsPage.getTitle()).to.eq('gatewayApp.documentmanagerAppDocument.home.title');
  });

  it('should load create AppDocument page', async () => {
    await appDocumentComponentsPage.clickOnCreateButton();
    appDocumentUpdatePage = new AppDocumentUpdatePage();
    expect(await appDocumentUpdatePage.getPageTitle()).to.eq('gatewayApp.documentmanagerAppDocument.home.createOrEditLabel');
    await appDocumentUpdatePage.cancel();
  });

  /*  it('should create and save AppDocuments', async () => {
        const nbButtonsBeforeCreate = await appDocumentComponentsPage.countDeleteButtons();

        await appDocumentComponentsPage.clickOnCreateButton();
        await promise.all([
            appDocumentUpdatePage.setContentInput('content'),
            appDocumentUpdatePage.setDocumentLinkInput('documentLink'),
            appDocumentUpdatePage.setBlobInput(absolutePath),
            appDocumentUpdatePage.categorySelectLastOption(),
            // appDocumentUpdatePage.tagsSelectLastOption(),
        ]);
        expect(await appDocumentUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
        expect(await appDocumentUpdatePage.getDocumentLinkInput()).to.eq('documentLink', 'Expected DocumentLink value to be equals to documentLink');
        expect(await appDocumentUpdatePage.getBlobInput()).to.endsWith(fileNameToUpload, 'Expected Blob value to be end with ' + fileNameToUpload);
        await appDocumentUpdatePage.save();
        expect(await appDocumentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await appDocumentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /*  it('should delete last AppDocument', async () => {
        const nbButtonsBeforeDelete = await appDocumentComponentsPage.countDeleteButtons();
        await appDocumentComponentsPage.clickOnLastDeleteButton();

        appDocumentDeleteDialog = new AppDocumentDeleteDialog();
        expect(await appDocumentDeleteDialog.getDialogTitle())
            .to.eq('gatewayApp.documentmanagerAppDocument.delete.question');
        await appDocumentDeleteDialog.clickOnConfirmButton();

        expect(await appDocumentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
