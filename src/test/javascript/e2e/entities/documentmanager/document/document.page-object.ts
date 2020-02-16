import { element, by, ElementFinder } from 'protractor';

export class DocumentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-document div table .btn-danger'));
  title = element.all(by.css('jhi-document div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class DocumentUpdatePage {
  pageTitle = element(by.id('jhi-document-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  contentInput = element(by.id('field_content'));
  documentLinkInput = element(by.id('field_documentLink'));
  blobInput = element(by.id('file_blob'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setContentInput(content: string): Promise<void> {
    await this.contentInput.sendKeys(content);
  }

  async getContentInput(): Promise<string> {
    return await this.contentInput.getAttribute('value');
  }

  async setDocumentLinkInput(documentLink: string): Promise<void> {
    await this.documentLinkInput.sendKeys(documentLink);
  }

  async getDocumentLinkInput(): Promise<string> {
    return await this.documentLinkInput.getAttribute('value');
  }

  async setBlobInput(blob: string): Promise<void> {
    await this.blobInput.sendKeys(blob);
  }

  async getBlobInput(): Promise<string> {
    return await this.blobInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class DocumentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-document-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-document'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
