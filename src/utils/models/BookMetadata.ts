export default interface BookMetadata {
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
}

export const emptyBookMetadata: BookMetadata = {
  totalCopies: 0,
  availableCopies: 0,
  borrowedCopies: 0
}