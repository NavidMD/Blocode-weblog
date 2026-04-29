export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}

// creating category required data
export interface NewCategoryRequestValuesDTO {
  name: string;
  urlHandle: string;
}

// updating category required data
export interface UpdateCategoryRequestValuesDTO {
  name: string;
  urlHandle: string;
}
