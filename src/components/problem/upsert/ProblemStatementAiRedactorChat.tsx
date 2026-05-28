'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { CheckIcon, EditNoteIcon, ErrorIcon, ExclamationIcon, SmartToyIcon, SpinIcon } from '@juki-team/base-ui/server-components';
import { Button, Input, MdMathViewer, T, useT } from '@juki-team/base-ui';
import { classNames, upperFirst } from '@juki-team/base-ui/helpers';
import { useRef } from 'hooks';
import { useEffect, useState } from 'react';
import { StatementDTO } from 'types';

interface ProblemStatementAiRedactorChatProps {
  statement: StatementDTO,
  setStatement: (statement: StatementDTO) => void,
  recordHistory: () => void,
}

const SUGGESTIONS = [
  {
    icon: <div>✨</div>,
    label: 'polish narrative',
    prompt: 'Si ya existe una historia, mejórala para que sea más profesional y fluida. Si no existe, crea una breve narrativa. En ambos casos, mantén la coherencia técnica y sugiere cambios si es necesario.',
  },
  {
    icon: <div>📏</div>,
    label: 'fix formatting',
    prompt: 'Revisa:\n  - Las reglas de formato.\n  - Las reglas de estructura del enunciado\n - Los casos de ejemplo.\n\nSugiere cambios si es necesario.',
  },
  {
    icon: <div>🧪</div>,
    label: 'edge cases',
    prompt: 'Revisa si los casos de ejemplo son validos analizando las restricciones y genera más casos de ejemplo si fuera necesario (como por ejemplo con valores límite mínimos/máximos).',
  },
  {
    icon: <div>🔍</div>,
    label: 'logic audit',
    prompt: 'Busca contradicciones o falta de claridad entre la descripción y el input/output. Si hay ambigüedades, corrígelas si fuera necesario.',
  },
];

export const ProblemStatementAiRedactorChat = ({
                                                 statement,
                                                 setStatement,
                                                 recordHistory,
                                               }: ProblemStatementAiRedactorChatProps) => {

  const [ isOpen, setIsOpen ] = useState(false);
  const [ input, setInput ] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/statement-redactor',
    }),
  });
  const t = useT();

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts as { type: string, input: StatementDTO, state: string }[]) {
        if (part?.type === 'tool-suggestStatement' && part?.state === 'input-streaming') {
          setStatement({
            description: typeof part?.input?.description === 'string' ? part?.input?.description : statement.description,
            input: typeof part?.input?.input === 'string' ? part?.input?.input : statement.input,
            output: typeof part?.input?.output === 'string' ? part?.input?.output : statement.output,
            note: typeof part?.input?.note === 'string' ? part?.input?.note : statement.note,
            sampleCases: Array.isArray(part?.input?.sampleCases) && part?.input?.sampleCases?.length > 0
              ? part?.input?.sampleCases.map(sample => ({
                input: typeof sample?.input === 'string' ? sample?.input : '',
                output: typeof sample?.output === 'string' ? sample?.output : '',
              }))
              : statement.sampleCases,
          });
        }
      }
    }
  }, [ messages, setStatement, statement.description, statement.input, statement.note, statement.output, statement.sampleCases ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    });
  }, [ messages ]);

  return (
    <div
      className={classNames('right-panel jk-br-ie tx-s jk-col gap nowrap stretch', { 'jk-pg-xsm bc-we': isOpen })}
      style={isOpen ? { width: '400px' } : { width: 'calc(var(--tx-h-m) + var(--pad-sm) + var(--pad-sm))' }}
    >
      <div
        className={classNames('jk-row center cr-we bc-io jk-pg-xsm jk-br-ie hr-e1', { 'vertical-text': !isOpen })}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'sticky', top: 0, zIndex: 1 }}
      >
        <SmartToyIcon />&nbsp;
        <T className="fw-bd tt-se">Juki AI redactor</T>
      </div>
      {isOpen && (<div>
          <div className="jk-col gap stretch ai-chat-messages">
            {messages.map(message => (
              <div key={message.id} className={classNames('message jk-br-ie bc-hl jk-pg-xsm', message.role)}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <div key={`${message.id}-${i}`}>
                          <MdMathViewer source={part.text} flatView />
                        </div>
                      );
                    case 'tool-suggestStatement':
                      return (
                        <div key={`${message.id}-${i}`} className="jk-row left fw-lr">
                          {part?.state === 'input-streaming' ?
                            <><T className="tt-se">applying changes</T>&nbsp;<SpinIcon
                              filledCircle
                              size="tiny"
                              className="cr-il"
                            /></>
                            : part?.state === 'output-available'
                              ? <>
                                <T className="tt-se">changes applied</T>&nbsp;
                                <CheckIcon filledCircle size="tiny" className="cr-ss" />
                              </> : <CheckIcon filledCircle size="tiny" />}
                        </div>
                      );
                  }
                })}
              </div>
            ))}
            <form
              onSubmit={e => {
                e.preventDefault();
                void sendMessage({ text: input }, { body: { statement } });
                recordHistory();
                setInput('');
              }}
            >
              <div className="jk-row wh-100 nowrap">
                {status === 'submitted'
                  ? <CheckIcon />
                  : status === 'ready'
                    ? <EditNoteIcon />
                    : status === 'error'
                      ? <ErrorIcon />
                      : status === 'streaming'
                        ? <SpinIcon />
                        : <ExclamationIcon />}
                <Input
                  expand
                  value={input}
                  placeholder={upperFirst(t('say something')) + '...'}
                  onChange={setInput}
                  disabled={status !== 'ready'}
                />
              </div>
            </form>
            <div className="jk-row gap jk-pg-xsm">
              {SUGGESTIONS.map((sug) => (
                <Button
                  key={sug.label}
                  onClick={() => {
                    recordHistory();
                    void sendMessage({ text: sug.prompt }, { body: { statement } });
                  }}
                  icon={sug.icon}
                  size="tiny"
                  type="secondary"
                >
                  <T className="tt-se">{sug.label}</T>
                </Button>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};
