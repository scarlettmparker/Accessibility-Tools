import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MenuItem from "@/_components/menu-item";
import { MenuEntry } from "@/content/menu";
import { mockT } from "../mocks";

const mockComponent = jest.fn(() => <div data-testid="mock-component" />);

describe("MenuItem", () => {
  const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

  afterEach(() => {
    jest.clearAllMocks();
    consoleWarnSpy.mockClear();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  it("renders the component when menuEntry.component exists", () => {
    const menuEntry: MenuEntry = {
      component: mockComponent,
    };
    const menuItem: [string, MenuEntry] = ["test", menuEntry];

    render(<MenuItem menuItem={menuItem} t={mockT} />);

    expect(screen.getByTestId("mock-component")).toBeInTheDocument();
  });

  it("returns null and warns when menuEntry.component is undefined", () => {
    const menuEntry: MenuEntry = {};
    const menuItem: [string, MenuEntry] = ["test", menuEntry];

    const { container } = render(<MenuItem menuItem={menuItem} t={mockT} />);

    expect(container.firstChild).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "NO COMPONENT FOUND for key:",
      "test"
    );
  });

  it("returns null and warns when menuEntry.component is null", () => {
    const menuEntry: MenuEntry = {
      component: undefined,
    };
    const menuItem: [string, MenuEntry] = ["test", menuEntry];

    const { container } = render(<MenuItem menuItem={menuItem} t={mockT} />);

    expect(container.firstChild).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "NO COMPONENT FOUND for key:",
      "test"
    );
  });
});
