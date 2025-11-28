import { TFunction } from "i18next";

// Mock TFunction
export const mockT = jest.fn((key: string) => key) as unknown as TFunction;
