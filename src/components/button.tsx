import { cn } from "@/utils/cn";

type ButtonProps = {
  /**
   * Button variant.
   */
  variant?: "default" | "secondary";

  /**
   * Button size.
   */
  size?: "default" | "icon";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Scarlet UI Button.
 */
const Button = (props: ButtonProps) => {
  const { variant: variant_, size: size_, ...rest } = props;
  const variant = variant_ ?? "default";
  const size = size_ ?? "default";

  return (
    <button
      {...rest}
      className={cn("button", variant, `size-${size}`, rest.className)}
    >
      {rest.children}
    </button>
  );
};

export default Button;
