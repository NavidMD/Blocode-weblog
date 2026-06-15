export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}

// creating category required data
export interface NewCategoryRequestValuesDTO {
  name: string;
  urlHandle: string;
  parentCategoryId: string | null;
}

// updating category required data
export interface UpdateCategoryRequestValuesDTO {
  name: string;
  urlHandle: string;
}
