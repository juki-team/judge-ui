import { Button, ButtonLoader, CodeEditor, FetcherLayer, Input, Select, SendIcon, T } from 'components';
import { jukiApiSocketManager } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import React, { useState } from 'react';
import { authorizedRequest, cleanRequest } from 'src/helpers';
import { useJukiNotification } from 'src/hooks';
import {
  CompanyResponseDTO,
  ContentResponseType,
  EmailDataResponseDTO,
  HTTPMethod,
  ProgrammingLanguage,
  Status,
} from 'types';

const passwordReset = `Hola, <span id="nombre-completo">{{nombre completo}}</span>.
<br />
<br />
Solicitaste restablecer la contraseña de tu cuenta en
<a href="https://judge.juki.app" target="_blank" style="color: #2468a6; text-decoration: none;">judge.juki.app</a>.
<br />
<br />
Tu usuario es
<a href="https://judge.juki.app/profile/{{nickname}}/profile" target="_blank" style="color: #2468a6; text-decoration: none;" id="user">
{{nickname}}
</a>
y tu nueva contraseña es
<span style="color: #828282; background: #f2f2f2; padding: 0 6px;" id="user-password">
{{password}}
</span>
una vez que ingreses te sugerimos actualizar tu contraseña.`;

const validateEmail = `Bienvenido a Juki.app
<br /> <br />
Haga click en el enlace a continuación para verificar su dirección de correo electrónico.
Esto es necesario para confirmar la propiedad de la dirección de correo electrónico.
<br /> <br />
<a href="https://judge.juge.app/email-validation/{{EMAIL_VALIDATION_TOKEN}}" style="color: #2468A6; text-decoration: none; display: block; text-align: center">
  Verifique su dirección de correo electrónico
</a>
<br />
Si tiene problemas intente copiar y pegar la siguiente URL en su navegador:
<br /> <br />
https://judge.juge.app/email-validation/{{EMAIL_VALIDATION_TOKEN}}
<br /> <br />
Este enlace es válido solo por 60 minutos.
Si ha caducado, inicie sesión en nuestra área de clientes para solicitar un nuevo enlace.
<br />`;

const sendCredentials = `Saludos <span id="nombre-completo">{{nombre completo}}</span>.
<br /> <br />
En nombre de los organizadores de la <span style="font-weight: bold;">Competencia interna ICPC UMSA DIV 1 2020</span>
les comunicamos lo siguiente:
<br /> <br />
Cronograma del día sábado 31 de octubre es:
<ul>
  <li>
    Por la mañana a horas 11:00, <span style="font-weight: bold;">Warm up</span>.
  </li>
  <li>
    Por la tarde de horas 14:00 a 19:00, <span style="font-weight: bold;">Competencia interna ICPC UMSA DIV 1 2020</span>.
  </li>
  <li>
    Por la tarde a horas 19:15, <span style="font-weight: bold;">solución de problemas y anuncio de clasificados</span>.
  </li>
</ul>
Se les enviara el enlace de la videollamada por correo una hora antes de cada competencia.
<br /> <br />
El concurso se llevara acabo en el juez <a href="https://judge.juki.app" style="color: #2468a6; text-decoration: none;">judge.juki.app</a>
tu usuario es
<a href="https://judge.juki.app/profile/{{nickname}}}/profile" style="color: #2468a6; text-decoration: none;" id="user">
{{nickname}}
</a>
y tu contraseña es
<span style="color: #828282; background: #f2f2f2; padding: 0 6px;" id="user-password">
{{password}}
</span>.
<br /> <br />
Exitos a todos.
<br />
Sigan programando.`;

export const MailManagement = ({ company }: { company: CompanyResponseDTO }) => {
  
  const { notifyResponse } = useJukiNotification();
  const [ password, setPassword ] = useState('');
  const [ from, setFrom ] = useState('');
  const [ to, setTo ] = useState('');
  const [ subject, setSubject ] = useState('');
  const [ content, setContent ] = useState(passwordReset);
  
  return (
    <FetcherLayer<ContentResponseType<EmailDataResponseDTO>>
      url={jukiApiSocketManager.API_V1.company.getEmailData({ params: { companyKey: company.key } }).url}
      options={{ revalidateOnFocus: true }}
    >
      {({ data, mutate }) => {
        const html = data?.success ? data.content.emailTemplate.replace('{{content}}', content) : '';
        return (
          <div className="jk-col extend gap nowrap stretch jk-pg-md bc-we jk-br-ie">
            <div className="jk-col gap stretch">
              <h3><T>send email</T></h3>
              <div className="jk-row nowrap">
                <T className="tt-se fw-bd">from</T>:&nbsp;
                <Select
                  options={(data?.success ? [ '', ...data.content.contactEmails ] : [ '' ]).map(value => ({
                    value,
                    label: value || '-',
                    disabled: !value,
                  }))}
                  selectedOption={{ value: from }}
                  onChange={({ value }) => setFrom(value)}
                  extend
                />&nbsp;
                <T className="tt-se fw-bd">password</T>:&nbsp;
                <Input type="password" value={password} onChange={(newValue) => setPassword(newValue)} />
              </div>
              <div className="jk-row nowrap">
                <T className="tt-se fw-bd">to</T>:&nbsp;
                <Input value={to} onChange={(newValue) => setTo(newValue)} extend />
              </div>
              <div className="jk-row nowrap">
                <T className="tt-se fw-bd">subject</T>:&nbsp;
                <Input value={subject} onChange={(newValue) => setSubject(newValue)} extend />
              </div>
            </div>
            <div className="jk-col gap stretch extend top nowrap">
              <div className="jk-row center gap">
                <div><T className="tt-se">template</T>:</div>
                <Button type="light" size="tiny" onClick={() => setContent(passwordReset)}><T>password
                  reset</T></Button>
                <Button type="light" size="tiny" onClick={() => setContent(validateEmail)}><T>validate
                  email</T></Button>
                <Button type="light" size="tiny" onClick={() => setContent(sendCredentials)}>
                  <T>send credentials</T>
                </Button>
              </div>
              <div className="jk-row stretch extend nowrap" style={{ height: 'calc(100% - 58px)', width: '100%' }}>
                <div style={{ height: '100%', width: '50%' }} className="flex-1">
                  <CodeEditor
                    sourceCode={content}
                    language={ProgrammingLanguage.HTML}
                    onChange={({ sourceCode }) => {
                      if (typeof sourceCode === 'string') {
                        setContent(sourceCode);
                      }
                    }}
                  />
                </div>
                <iframe style={{ width: '50%' }} srcDoc={html}></iframe>
              </div>
            </div>
            <ButtonLoader
              extend
              size="small"
              disabled={!to || !subject || !from || !password}
              icon={<SendIcon />}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                  JUDGE_API_V1.SYS.MAIL_SEND(),
                  { method: HTTPMethod.POST, body: JSON.stringify({ from, to, subject, html, password }) }),
                );
                notifyResponse(response, setLoaderStatus);
              }}
            >
              <T>send</T>
            </ButtonLoader>
          </div>
        );
      }}
    </FetcherLayer>
  );
};
