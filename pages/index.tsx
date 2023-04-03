import Button from '@/components/Button'
import Select from '@/components/Select'
import TextInput from '@/components/TextInput'
import languages from '@/lib/languages.json'
import { copy } from 'clipboard'
import { NextPage } from 'next'
import { FC, TextareaHTMLAttributes, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

const Textarea: FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  return (
    <textarea
      {...props}
      rows={20}
      className={`border-4 border-gray-800 rounded-lg p-4 lg:w-[30vw] text-gray-900 ${props?.className}`}
    />
  )
}

function isJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const Home: NextPage<Props> = ({}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'translate' | 'fillEmpty'>('translate')
  const [inputLanguage, setInputLanguage] = useState('en')
  const [outputLanguage, setOutputLanguage] = useState('de')
  const [openaiKey, setOpenaiKey] = useState('')

  const handleSubmit = async (text: string) => {
    const isJson = isJsonString(text)

    if (!isJson) {
      toast.error('Please enter valid json')
      return
    }

    const parsed = JSON.parse(text)

    if (
      mode === 'translate' &&
      Object.keys(parsed).some((k) => parsed[k] === '')
    ) {
      toast.error('Please fill all empty values')

      return
    }

    setIsLoading(true)

    const res = await fetch('/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        inputLanguage,
        outputLanguage,
        mode,
        ...(openaiKey && { key: openaiKey }),
      }),
    }).then((res) => res.json())

    if (!res.success) {
      toast.error(res.error)

      setIsLoading(false)
      return
    }

    setOutput(JSON.stringify(res.data, null, 2))
    toast.success("Here's your translated JSON")

    setIsLoading(false)
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <Toaster />
      <div className='flex items-center flex-col mb-12'>
        <h1 className='text-8xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-6 '>
          Translate your JSON
        </h1>
        <div className='w-[400px]'>
          <TextInput
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            label='OpenAi Key'
            className='mb-4'
            placeholder='Paste your OpenAi Key here if you did not use a .env file'
          />
          <Select
            className='!w-full'
            label='Mode'
            onChange={(mode) => {
              setMode(mode as any)
              setOutput('')
              setInput('')
            }}
            options={[
              { label: 'Translate', value: 'translate' },
              { label: 'Fill Empty JSON file', value: 'fillEmpty' },
            ]}
            value={mode}
          />
        </div>
      </div>
      <div className='w-full p-4'>
        <form
          className='flex flex-col items-center'
          onSubmit={(e) => {
            e.preventDefault()

            handleSubmit(input)
          }}>
          <div className='flex justify-around lg:flex-row flex-col w-full mb-20'>
            <div className='flex flex-col'>
              <label className='text-gray-400'>Input</label>
              <Select
                label=''
                className='my-2'
                value={inputLanguage}
                onChange={setInputLanguage}
                options={languages.languages.map((l) => ({
                  label: l.name,
                  value: l.short,
                }))}
              />

              <Textarea
                className='mt-2'
                value={input}
                placeholder='Paste your json here...'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className='flex flex-col lg:mt-0 mt-8'>
              <label className='text-gray-400'>Output</label>
              <Select
                label=''
                className='my-2'
                value={outputLanguage}
                onChange={setOutputLanguage}
                options={languages.languages.map((l) => ({
                  label: l.name,
                  value: l.short,
                }))}
              />

              <Textarea
                className='mt-2'
                placeholder='Your Output will be displayed here...'
                readOnly
                value={output}
              />
              <div className='mt-2 flex'>
                <Button
                  disabled={!output}
                  onClick={() => {
                    copy(output)
                    toast.success('Copied to clipboard')
                  }}
                  type='button'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184'
                      />
                    </svg>
                  }>
                  Copy to Clipboard
                </Button>
                <Button
                  className='ml-4'
                  disabled={!output}
                  onClick={() => {
                    //download the output in a json file
                    const element = document.createElement('a')
                    const file = new Blob([output], {
                      type: 'application/json',
                    })
                    element.href = URL.createObjectURL(file)
                    element.download = `${outputLanguage}.json`
                    document.body.appendChild(element) // Required for this to work in FireFox
                    element.click()

                    toast.success('Downloaded')

                    document.body.removeChild(element)
                  }}
                  type='button'
                  icon={
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-6 h-6'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25'
                      />
                    </svg>
                  }>
                  Download
                </Button>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <Button isLoading={isLoading}>
              {mode === 'translate' ? 'Translate' : 'Fill Empty'}
            </Button>
            {isLoading && (
              <p className='text-gray-400 mt-4'>
                Translating may take some time, have a little patience :)
              </p>
            )}
          </div>
        </form>
      </div>
      <div className='flex mt-20 mb-8'>
        <a
          target='_blank'
          rel='noreferrer'
          href='https://github.com/BjoernRave/ai-json-translator'
          className='p-2 px-4 bg-white rounded-lg flex items-center text-gray-900'>
          <img
            alt='Github Logo'
            src='/github-mark.svg'
            className='w-8 h-8 mr-2'
          />
          Github
        </a>
        <a
          target='_blank'
          rel='noreferrer'
          href='https://bjoern-rave.com'
          className='p-2 px-4 bg-white rounded-lg flex items-center text-gray-900 ml-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-8 h-8 mr-2'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          My Website
        </a>
      </div>
    </div>
  )
}

export default Home

interface Props {}
