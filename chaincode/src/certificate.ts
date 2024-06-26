/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Certificate {
  @Property()
  public Id: string;

  @Property()
  public Institute: string;

  @Property()
  public Recipient: string;

  @Property()
  public Major: string;

  @Property()
  public DegreeLevel: string;

  @Property()
  public IssuingDate: string;

  @Property()
  public IssuingHead: string;

  @Property()
  public Status: string;
}

export interface CertificateRequest {
  id: string;
  institute: string;
  recipient: string;
  major: string;
  degreeLevel: string;
  issuingDate: string;
  issuingHead: string;
}
