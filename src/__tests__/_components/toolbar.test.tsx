import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Toolbar from "@/_components/toolbar";
import { MenuEntry } from "@/content/menu";
import { mockT } from "../mocks";
import { TFunction } from "i18next";

jest.mock("@/_components/menu-item", () => ({
  __esModule: true,
  default: ({
    menuItem,
    t,
  }: {
    menuItem: [string, MenuEntry];
    t: TFunction;
  }) => {
    const [key] = menuItem;
    // We just want to check that switching menus works in our example
    return <div data-testid="menu-item">{key}</div>;
  },
}));

jest.mock("@/_components/menus/text", () => ({
  __esModule: true,
  default: () => <div data-testid="text-menu" />,
}));

describe("Toolbar", () => {
  it("renders all menu buttons", () => {
    render(<Toolbar />);
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.text-to-speech"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.text"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.theme"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.dictionary"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.translate"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.magnify"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.manual"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(
        "button-toolbar.menu.title.prefix toolbar.menu.title.settings"
      )
    ).toBeInTheDocument();
  });

  it("does not render menu item initially", () => {
    render(<Toolbar />);
    expect(screen.queryByTestId("menu-item")).not.toBeInTheDocument();
  });

  it("renders menu item when button is clicked", () => {
    render(<Toolbar />);
    const button = screen.getByTestId(
      "button-toolbar.menu.title.prefix toolbar.menu.title.text-to-speech"
    );
    fireEvent.click(button);
    expect(screen.getByTestId("menu-item")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item")).toHaveTextContent("text-to-speech");
  });

  it("deselects menu when clicked again", () => {
    render(<Toolbar />);
    const button = screen.getByTestId(
      "button-toolbar.menu.title.prefix toolbar.menu.title.text-to-speech"
    );
    fireEvent.click(button);
    expect(screen.getByTestId("menu-item")).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByTestId("menu-item")).not.toBeInTheDocument();
  });

  it("selects different menu", () => {
    render(<Toolbar />);
    const button1 = screen.getByTestId(
      "button-toolbar.menu.title.prefix toolbar.menu.title.text-to-speech"
    );
    const button2 = screen.getByTestId(
      "button-toolbar.menu.title.prefix toolbar.menu.title.text"
    );
    fireEvent.click(button1);
    expect(screen.getByTestId("menu-item")).toHaveTextContent("text-to-speech");
    fireEvent.click(button2);
    expect(screen.getByTestId("menu-item")).toHaveTextContent("text");
  });

  it("renders slots with correct classNames", () => {
    render(<Toolbar />);
    expect(screen.getByTestId("slot-toolbar-wrapper")).toHaveClass(
      "toolbar-wrapper"
    );
    const button = screen.getByTestId(
      "button-toolbar.menu.title.prefix toolbar.menu.title.text"
    );
    fireEvent.click(button);
    expect(screen.getByTestId("slot-menu-item-wrapper")).toHaveClass(
      "menu-item-wrapper"
    );
  });

  it("calls t function with correct keys for titles and labels", () => {
    render(<Toolbar />);
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.prefix");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.text-to-speech");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.text");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.theme");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.dictionary");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.translate");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.magnify");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.manual");
    expect(mockT).toHaveBeenCalledWith("toolbar.menu.title.settings");
  });

  it("renders buttons with correct aria-labels", () => {
    render(<Toolbar />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.text-to-speech"
    );
    expect(buttons[1]).toHaveAttribute("aria-label", "toolbar.menu.title.text");
    expect(buttons[2]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.theme"
    );
    expect(buttons[3]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.dictionary"
    );
    expect(buttons[4]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.translate"
    );
    expect(buttons[5]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.magnify"
    );
    expect(buttons[6]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.manual"
    );
    expect(buttons[7]).toHaveAttribute(
      "aria-label",
      "toolbar.menu.title.settings"
    );
  });
});
