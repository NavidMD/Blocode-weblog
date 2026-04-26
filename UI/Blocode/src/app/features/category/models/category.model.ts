export interface Category {
  id: string;
  name: string;
  urlHandle: string;
}

// creating category required data
export interface NewCategoryRequestValues {
  name: string;
  urlHandle: string;
}

