import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MenuEntry } from "@/content/menu";
import Toolbar from "@/_components/toolbar";

jest.mock("@/_components/menu-item", () => ({
  __esModule: true,
  default: ({ menu }: { menu: [string, MenuEntry] }) => (
    <div data-testid="menu-item">{menu[0]}</div>
  ),
}));

// Mocks
jest.mock("@/components/button", () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
    title,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      onClick={onClick}
      title={title}
      {...props}
      data-testid={`button-${title}`}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/slot", () => ({
  __esModule: true,
  default: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren) => (
    <div className={className} data-testid={`slot-${className}`} {...props}>
      {children}
    </div>
  ),
}));

describe("Toolbar", () => {
  it("renders all menu buttons", () => {
    render(<Toolbar />);
    expect(screen.getByTestId("button-text-to-speech")).toBeInTheDocument();
    expect(screen.getByTestId("button-text")).toBeInTheDocument();
    expect(screen.getByTestId("button-theme")).toBeInTheDocument();
    expect(screen.getByTestId("button-dictionary")).toBeInTheDocument();
    expect(screen.getByTestId("button-translate")).toBeInTheDocument();
    expect(screen.getByTestId("button-magnify")).toBeInTheDocument();
    expect(screen.getByTestId("button-manual")).toBeInTheDocument();
    expect(screen.getByTestId("button-settings")).toBeInTheDocument();
  });

  it("does not render menu item initially", () => {
    render(<Toolbar />);
    expect(screen.queryByTestId("menu-item")).not.toBeInTheDocument();
  });

  it("renders menu item when button is clicked", () => {
    render(<Toolbar />);
    const button = screen.getByTestId("button-text-to-speech");
    fireEvent.click(button);
    expect(screen.getByTestId("menu-item")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item")).toHaveTextContent("text-to-speech");
  });

  it("deselects menu when clicked again", () => {
    render(<Toolbar />);
    const button = screen.getByTestId("button-text-to-speech");
    fireEvent.click(button);
    expect(screen.getByTestId("menu-item")).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByTestId("menu-item")).not.toBeInTheDocument();
  });

  it("selects different menu", () => {
    render(<Toolbar />);
    const button1 = screen.getByTestId("button-text-to-speech");
    const button2 = screen.getByTestId("button-text");
    fireEvent.click(button1);
    expect(screen.getByTestId("menu-item")).toHaveTextContent("text-to-speech");
    fireEvent.click(button2);
    expect(screen.getByTestId("menu-item")).toHaveTextContent("text");
  });
});
