export const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="jk-row left jk-breadcrumb pad-left-right">
      {/*<ArrowRightIcon />*/}
      <div className="separator">|</div>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <>
            {!!index && <div className="separator">/</div>}
            <div>{breadcrumb}</div>
          </>
        );
      })}
    </div>
  );
};
