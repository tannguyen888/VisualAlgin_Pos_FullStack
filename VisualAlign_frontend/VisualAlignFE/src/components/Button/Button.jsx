import { Link } from 'react-router-dom';
import { Button as ShadcnButton } from '@/components/ui/button';

function Button({
  className,
  onClick,
  children,
  disabled = false,
  disable = false,
  outline = false,
  variant,
  size,
  to,
  href,
  target,
  rel,
  ...rest
}) {
  const isDisabled = disabled || disable;
  const resolvedVariant = variant || (outline ? 'outline' : 'default');
  const disabledClass = isDisabled ? 'pointer-events-none opacity-50' : '';
  const mergedClassName = [className, disabledClass].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  if (to) {
    return (
      <ShadcnButton
        className={mergedClassName}
        variant={resolvedVariant}
        size={size}
        asChild
        onClick={handleClick}
        aria-disabled={isDisabled || undefined}
        {...rest}
      >
        <Link to={to}>{children}</Link>
      </ShadcnButton>
    );
  }

  if (href) {
    const safeRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel;

    return (
      <ShadcnButton
        className={mergedClassName}
        variant={resolvedVariant}
        size={size}
        asChild
        onClick={handleClick}
        aria-disabled={isDisabled || undefined}
        {...rest}
      >
        <a href={href} target={target} rel={safeRel}>
          {children}
        </a>
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      className={className}
      variant={resolvedVariant}
      size={size}
      disabled={isDisabled}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </ShadcnButton>
  );
}

export default Button;