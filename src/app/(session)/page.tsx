'use client';

import { MdMathViewer, T } from 'components';
import { jukiAppRoutes } from 'config';
import { JUKI_APP_COMPANY_KEY } from 'config/constants';
import { useUIStore, useUserStore } from 'hooks';
import { ProfileSetting } from 'types';
import { BOARDS_INFO, CONTESTS_INFO, IDE_INFO, PROBLEMS_INFO } from './text';

export default function Home() {
  
  const companyKey = useUserStore(state => state.company.key);
  const companyName = useUserStore(state => state.company.name);
  const preferredLanguage = useUserStore(state => state.user.settings[ProfileSetting.LANGUAGE]);
  const { Link, Image } = useUIStore(store => store.components);
  const viewPortWidth = useUIStore(store => store.viewPortWidth);
  const width = Math.max(Math.min(viewPortWidth, 1024), 512);
  
  return (
    <div className="jk-col gap center">
      <div className="jk-col gap jk-pg-lg nowrap extend stretch  pn-re bc-we" style={{ width: '100%' }}>
        <h1 className="jk-pg-t ta-cr">
          <T className="tt-se">welcome to</T>&nbsp;<span className="fw-br cr-sy ws-np">{companyName}</span>&nbsp;
          <span className="fw-br cr-py">judge</span>
        </h1>
        <div className="jk-row pn-re">
          <div className="jk-col gap ta-cr">
            <h3><T className="tt-se">competitive programmers home</T></h3>
            <p>{companyName} judge <T>is designed to make people improve their programming skills</T></p>
          </div>
          <div className="pn-re wh-100" style={{ height: 256 }}>
            <Image src="https://images.juki.pub/assets/juki-image-judge.png" alt="Juki as judge" fill />
          </div>
        </div>
      </div>
      <div className="jk-col nowrap center top extend gap pn-re jk-pg-lg" style={{ maxWidth: width }}>
        <Link href={jukiAppRoutes.JUDGE().problems.list()} className="jk-br-ie hoverable-elevation jk-pg bc-we">
          <div className="jk-row-col nowrap gap jk-pg-xsm jk-br-ie">
            <div className="jk-row">
              <Image
                height={width * 0.2}
                width={width * 0.3}
                alt="Juki Problems"
                src="https://images.juki.pub/r/468e3736-e89b-4e7c-90ef-cca467876caf.png"
              />
            </div>
            <div className="bc-we jk-br-ie jk-pg-xsm">
              <h2><T className="tt-se">explore problems from multiple judges</T></h2>
              <MdMathViewer source={PROBLEMS_INFO[preferredLanguage]} />
            </div>
          </div>
        </Link>
        <Link href={jukiAppRoutes.JUDGE().contests.list()} className="jk-br-ie hoverable-elevation jk-pg bc-we">
          <div className="jk-row-col nowrap gap jk-pg-xsm jk-br-ie">
            <div className="bc-we jk-br-ie jk-pg-xsm">
              <h2><T className="tt-se">participate in contests or create your own</T></h2>
              <MdMathViewer source={CONTESTS_INFO[preferredLanguage]} />
            </div>
            <div className="jk-row">
              <Image
                height={width * 0.2}
                width={width * 0.3}
                alt="Juki Contests"
                src="https://images.juki.pub/r/98ec334a-589f-494a-bb40-9d03fa956e60.png"
              />
            </div>
          </div>
        </Link>
        {companyKey === JUKI_APP_COMPANY_KEY && (
          <Link href={jukiAppRoutes.JUDGE().boards.page()} className="jk-br-ie hoverable-elevation jk-pg bc-we">
            <div className="jk-row-col nowrap gap jk-pg-xsm jk-br-ie">
              <div className="jk-row">
                <Image
                  height={width * 0.2}
                  width={width * 0.3}
                  alt="Juki Boards"
                  src="https://images.juki.pub/r/bbaa4fae-ebf2-4bbc-a2e5-a2af3044f6f5.png"
                />
              </div>
              <div className="bc-we jk-br-ie jk-pg-xsm">
                <h2><T className="tt-se">challenge others in open and ongoing competitions</T></h2>
                <MdMathViewer source={BOARDS_INFO[preferredLanguage]} />
              </div>
            </div>
          </Link>
        )}
        <Link href={jukiAppRoutes.JUDGE().ide.page()} className="jk-br-ie hoverable-elevation jk-pg bc-we">
          <div className="jk-row-col nowrap gap jk-pg-xsm jk-br-ie">
            <div className="bc-we jk-br-ie jk-pg-xsm">
              <h2><T className="tt-se">integrated online editor</T></h2>
              <MdMathViewer source={IDE_INFO[preferredLanguage]} />
            </div>
            <div className="jk-row">
              <Image
                height={width * 0.2}
                width={width * 0.3}
                alt="Juki Contests"
                src="https://images.juki.pub/r/6e157e60-c99e-4829-a363-3ff425f25349.png"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
