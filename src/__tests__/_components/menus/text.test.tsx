import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Text from "@/_components/menus/text";
import { mockT } from "../../mocks";
import { adjustFontSize, resetFontSize } from "@/utils/text";
import { setFontFace } from "@/utils/font-face";

jest.mock("@/utils/text", () => ({
  adjustFontSize: jest.fn(),
  resetFontSize: jest.fn(),
}));

jest.mock("@/utils/font-face", () => ({
  fontFaces: [
    { name: "Default", value: "system-ui, sans-serif" },
    { name: "Arial", value: "Arial, sans-serif" },
  ],
  setFontFace: jest.fn(),
  getCurrentFontFace: jest.fn(() => "system-ui, sans-serif"),
}));

describe("Text menu", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders font size controls with correct attributes", () => {
    render(<Text t={mockT} />);

    expect(screen.getByText("text.font-size")).toBeInTheDocument();

    const resetButton = screen.getByLabelText("text.reset-font-size.aria");
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute("title", "text.reset-font-size.title");
    expect(resetButton).toHaveStyle({ marginLeft: "auto" });
    expect(resetButton).toHaveTextContent("text.reset-font-size.text");

    const decreaseButton = screen.getByLabelText(
      "text.decrease-font-size.aria"
    );
    expect(decreaseButton).toBeInTheDocument();
    expect(decreaseButton).toHaveAttribute(
      "title",
      "text.decrease-font-size.title"
    );
    expect(decreaseButton).toHaveTextContent("-");

    const increaseButton = screen.getByLabelText(
      "text.increase-font-size.aria"
    );
    expect(increaseButton).toBeInTheDocument();
    expect(increaseButton).toHaveAttribute(
      "title",
      "text.increase-font-size.title"
    );
    expect(increaseButton).toHaveTextContent("+");
  });

  it("calls functions on button clicks", () => {
    render(<Text t={mockT} />);

    const resetButton = screen.getByLabelText("text.reset-font-size.aria");
    fireEvent.click(resetButton);
    expect(resetFontSize).toHaveBeenCalledTimes(1);

    const decreaseButton = screen.getByLabelText(
      "text.decrease-font-size.aria"
    );
    fireEvent.click(decreaseButton);
    expect(adjustFontSize).toHaveBeenCalledWith("decrease");

    const increaseButton = screen.getByLabelText(
      "text.increase-font-size.aria"
    );
    fireEvent.click(increaseButton);
    expect(adjustFontSize).toHaveBeenCalledWith("increase");
  });

  it("renders font face selector with correct attributes", () => {
    render(<Text t={mockT} />);

    const label = screen.getByText("text.font-face");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "font-face-select");

    const select = screen.getByLabelText("text.font-face") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("id", "font-face-select");
    expect(select).toHaveStyle({ marginLeft: "auto" });
    expect(select.value).toBe("system-ui, sans-serif");

    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveAttribute("value", "system-ui, sans-serif");
    expect(options[0]).toHaveTextContent("Default");
    expect(options[1]).toHaveAttribute("value", "Arial, sans-serif");
    expect(options[1]).toHaveTextContent("Arial");
  });

  it("changes font face on select", () => {
    render(<Text t={mockT} />);

    const select = screen.getByLabelText("text.font-face") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "Arial, sans-serif" } });

    expect(setFontFace).toHaveBeenCalledWith("Arial, sans-serif");
  });
});
