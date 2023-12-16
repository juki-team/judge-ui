import { ACCEPTED_PROGRAMMING_LANGUAGES, PROGRAMMING_LANGUAGE } from '@juki-team/commons';
import { Breadcrumbs, HomeLink, T, TwoContentSection } from 'components';
import { useJukiUser } from 'hooks';

export default function Home() {
  
  const breadcrumbs = [
    <HomeLink key="home" />,
  ];
  
  const { company: { name } } = useJukiUser();
  
  return (
    <TwoContentSection>
      <div className="jk-col extend stretch">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right jk-row nowrap extend stretch gap" style={{ boxSizing: 'border-box' }}>
          <h1 style={{ padding: 'var(--pad-md) 0' }}>
            <T>help</T>
          </h1>
        </div>
      </div>
      <div className="pad-left-right pad-top-bottom">
        {ACCEPTED_PROGRAMMING_LANGUAGES.map((value, index, array) => {
          return (
            <div>
              <h3>{PROGRAMMING_LANGUAGE[value].label}</h3>
              <div>
              
              </div>
            </div>
          )
        })}
      </div>
    </TwoContentSection>
  );
}
