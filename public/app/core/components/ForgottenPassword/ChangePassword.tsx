import React, { SyntheticEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import { selectors } from '@grafana/e2e-selectors';
import { Tooltip, Field, VerticalGroup, Button, Alert, useStyles2 } from '@grafana/ui';

import { getStyles } from '../Login/LoginForm';
import { PasswordField } from '../PasswordField/PasswordField';
import {
  ValidationLabels,
  strongPasswordValidations,
  strongPasswordValidationRegister,
} from '../ValidationLabels/ValidationLabels';

interface Props {
  onSubmit: (pw: string) => void;
  onSkip?: (event?: SyntheticEvent) => void;
  showDefaultPasswordWarning?: boolean;
}

interface PasswordDTO {
  newPassword: string;
  confirmNew: string;
}

export const ChangePassword = ({ onSubmit, onSkip, showDefaultPasswordWarning }: Props) => {
  const styles = useStyles2(getStyles);
  const [displayValidationLabels, setDisplayValidationLabels] = useState(false);
  const [pristine, setPristine] = useState(true);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    watch,
  } = useForm<PasswordDTO>({
    defaultValues: {
      newPassword: '',
      confirmNew: '',
    },
  });

  const newPassword = watch('newPassword');
  const submit = (passwords: PasswordDTO) => {
    onSubmit(passwords.newPassword);
  };
  return (
    <form onSubmit={handleSubmit(submit)}>
      {showDefaultPasswordWarning && (
        <Alert severity="info" title="Continuing to use the default password exposes you to security risks." />
      )}
      <Field label="New password" invalid={!!errors.newPassword} error={errors?.newPassword?.message}>
        <PasswordField
          onFocus={() => setDisplayValidationLabels(true)}
          {...register('newPassword', {
            required: 'New Password is required',
            onBlur: () => setPristine(false),
            validate: { strongPasswordValidationRegister },
          })}
          id="new-password"
          autoFocus
          autoComplete="new-password"
        />
      </Field>
      {displayValidationLabels && (
        <ValidationLabels
          pristine={pristine}
          password={newPassword}
          strongPasswordValidations={strongPasswordValidations}
        />
      )}
      <Field label="Confirm new password" invalid={!!errors.confirmNew} error={errors?.confirmNew?.message}>
        <PasswordField
          {...register('confirmNew', {
            required: 'Confirmed Password is required',
            validate: (v: string) => v === getValues().newPassword || 'Passwords must match!',
          })}
          id="confirm-new-password"
          autoComplete="new-password"
        />
      </Field>
      <VerticalGroup>
        <Button type="submit" className={styles.submitButton}>
          Submit
        </Button>

        {onSkip && (
          <Tooltip
            content="If you skip you will be prompted to change password next time you log in."
            placement="bottom"
          >
            <Button fill="text" onClick={onSkip} type="button" data-testid={selectors.pages.Login.skip}>
              Skip
            </Button>
          </Tooltip>
        )}
      </VerticalGroup>
    </form>
  );
};
