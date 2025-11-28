type SlotProps = React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren;

/**
 * Styled slot component.
 */
const Slot = (props: SlotProps) => {
  const { children, className, ...rest } = props;

  return (
    <div className={`slot ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Slot;
