import { element, by, ElementFinder } from 'protractor';

export class AppDocumentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-app-document div table .btn-danger'));
  title = element.all(by.css('jhi-app-document div h2#page-heading span')).first();

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

export class AppDocumentUpdatePage {
  pageTitle = element(by.id('jhi-app-document-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  contentInput = element(by.id('field_content'));
  documentLinkInput = element(by.id('field_documentLink'));
  blobInput = element(by.id('file_blob'));
  categorySelect = element(by.id('field_category'));
  tagsSelect = element(by.id('field_tags'));

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

  async categorySelectLastOption(): Promise<void> {
    await this.categorySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async categorySelectOption(option: string): Promise<void> {
    await this.categorySelect.sendKeys(option);
  }

  getCategorySelect(): ElementFinder {
    return this.categorySelect;
  }

  async getCategorySelectedOption(): Promise<string> {
    return await this.categorySelect.element(by.css('option:checked')).getText();
  }

  async tagsSelectLastOption(): Promise<void> {
    await this.tagsSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async tagsSelectOption(option: string): Promise<void> {
    await this.tagsSelect.sendKeys(option);
  }

  getTagsSelect(): ElementFinder {
    return this.tagsSelect;
  }

  async getTagsSelectedOption(): Promise<string> {
    return await this.tagsSelect.element(by.css('option:checked')).getText();
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

export class AppDocumentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-appDocument-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-appDocument'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
