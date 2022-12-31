export const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="jk-row left jk-breadcrumb pad-left-right">
      {breadcrumbs.map(breadcrumb => {
        return (
          <>
            <div className="separator">/</div>
            <div>{breadcrumb}</div>
          </>
        );
      })}
    </div>
  );
};
