import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NoFileExtensionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formValue = control.value.toLowerCase();
    const forbiddenExtensions = [
      '.png',
      '.jpg',
      '.jpeg',
      '.webp',
      '.gif',
      '.bmp',
      '.svg',
      '.ico',
      '.tiff',
      '.heic',
      '.avif',
    ];
    // بررسی میکنیم ببینیم مقدار اینپوت حاوی اکستنشن هست یا نه
    const valueHasExtension = forbiddenExtensions.some((ex) => formValue.endsWith(ex));
    // اگر حاوی اکستنشن بود یه آبجکت دلخواه برمیگردونیم اگر نه نال چون نال برگرده ینی اینپوت ولید بوده
    return valueHasExtension
      ? { fileExtension: { forbiddenExtensions: forbiddenExtensions, actualValue: formValue } }
      : null;
  };
}
