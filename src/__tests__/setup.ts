// Import shared mocks
import "../components/components.mocks";
import { mockT } from "./mocks";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));
