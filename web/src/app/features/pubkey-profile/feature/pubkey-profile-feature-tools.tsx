import { Button, Group, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-program-library/anchor'
import { GetProfileByProvider, GetProfileByUsername } from '@pubkey-program-library/sdk'
import { toastError, toastSuccess, UiCard, UiDebug, UiGroup, UiStack } from '@pubkey-ui/core'
import { useState } from 'react'
import { getEnumOptions } from '../../../ui-select-enum'
import { ellipsify } from '../../account/ui/ellipsify'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { usePubKeyProfile } from '../data-access'
import { PubkeyProfileUiProfile } from '../ui'

export function PubkeyProfileFeatureTools() {
  const { sdk } = usePubKeyProfile()
  return (
    <UiStack>
      <UiCard title="Search by Username">
        <SearchByUsername />
      </UiCard>
      <UiCard title="Search by Provider">
        <SearchByProvider />
      </UiCard>
      <UiGroup>
        <ExplorerLink ff="mono" path={`account/${sdk.programId}`} label={ellipsify(sdk.programId.toString())} />
      </UiGroup>
    </UiStack>
  )
}

function SearchByProvider() {
  const [result, setResult] = useState<PubKeyProfile | null>(null)
  const { sdk } = usePubKeyProfile()
  const form = useForm<GetProfileByProvider>({
    initialValues: {
      provider: PubKeyIdentityProvider.Solana,
      providerId: '',
    },
  })

  async function submit({ provider, providerId }: GetProfileByProvider) {
    setResult(null)
    sdk
      .getProfileByProvider({ provider, providerId })
      .then((profile) => {
        toastSuccess(`Found ${profile.username}`)
        setResult(profile)
      })
      .catch((err) => {
        toastError(`Provider ${provider} ${providerId} not found`)
        console.log('err', err)
      })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <Select
          data={getEnumOptions(PubKeyIdentityProvider)}
          name="provider"
          label="Provider"
          {...form.getInputProps('provider')}
        />

        <TextInput name="providerId" label="Provider ID" {...form.getInputProps('providerId')} />
        <Group justify="right">
          <Button type="submit">Check</Button>
        </Group>
        {result ? <PubkeyProfileUiProfile profile={result} /> : 'No Result'}
        <UiDebug data={result ?? 'No Result'} open />
      </UiStack>
    </form>
  )
}

function SearchByUsername() {
  const [result, setResult] = useState<PubKeyProfile | null>(null)
  const { sdk } = usePubKeyProfile()
  const form = useForm<GetProfileByUsername>({
    initialValues: {
      username: 'beeman',
    },
  })

  async function submit({ username }: GetProfileByUsername) {
    setResult(null)
    sdk
      .getProfileByUsername({ username })
      .then((profile) => {
        toastSuccess(`Found ${profile.username}`)
        setResult(profile)
      })
      .catch((err) => {
        toastError(`User ${username} not found`)
        console.log('err', err)
      })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput name="username" label="Username" {...form.getInputProps('username')} />
        <Group justify="right">
          <Button type="submit">Check</Button>
        </Group>
        {result ? <PubkeyProfileUiProfile profile={result} /> : 'No Result'}
        <UiDebug data={result ?? 'No Result'} open />
      </UiStack>
    </form>
  )
}