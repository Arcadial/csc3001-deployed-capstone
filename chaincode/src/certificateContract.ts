/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Certificate, CertificateRequest } from './certificate';
import compareCertificates from './compareCertificates';

@Info({
  title: 'CertificateContract',
  description: 'Smart contract for managing certificates',
})
export class CertificateContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    const certificates: Certificate[] = [
      {
        Id: '71a6ce16-0bce-4b14-b582-0b6decb0e134',
        Institute: 'Cavall University',
        Recipient: 'James Andersons',
        Major: 'Computer Engineering',
        DegreeLevel: 'Bachelor of Science',
        IssuingDate: '2030-06-25T00:00:00',
        IssuingHead: 'Katherine Johnson',
        Status: 'Active',
      },
      {
        Id: '3b01bb93-a92c-4da6-a8c5-c2efb692ddf9',
        Institute: 'Cavall University',
        Recipient: 'Madeline Luna',
        Major: 'English Literature',
        DegreeLevel: 'Bachelor of Arts',
        IssuingDate: '2022-06-01T00:00:00',
        IssuingHead: 'Katherine Johnson',
        Status: 'Active',
      },
      {
        Id: '045dddda-d5e0-49dc-ad58-4ed63965491c',
        Institute: 'Cavall University',
        Recipient: 'Benjamin Ingram',
        Major: 'Information Systems',
        DegreeLevel: 'Bachelor of Computing',
        IssuingDate: '2001-12-01T00:00:00',
        IssuingHead: 'of',
        Status: 'Active',
      },
      {
        Id: '9ea55310-c023-46a9-8988-eb8cd0c93b6e',
        Institute: 'Truman College of Engineering',
        Recipient: 'Sebastian Cortez',
        Major: 'Civil Engineering',
        DegreeLevel: 'Bachelor of Engineering',
        IssuingDate: '2024-08-27T00:00:00',
        IssuingHead: 'Dorothy Canon',
        Status: 'Active',
      },
      {
        Id: '206194ce-3ce4-4d3b-9a9a-28dd2f6f5f65',
        Institute: 'Truman College of Engineering',
        Recipient: 'Samia Parker',
        Major: 'Architecture',
        DegreeLevel: 'Bachelor of Arts',
        IssuingDate: 'Invalid Date',
        IssuingHead: 'Dorothy Canon',
        Status: 'Active',
      },
    ];

    for (const certificate of certificates) {
      await ctx.stub.putState(
        certificate.Id,
        Buffer.from(stringify(sortKeysRecursive(certificate)))
      );
      console.info(`Asset ${certificate.Id} initialized`);
    }
  }

  // Processes new certificate and adds it to the ledger
  @Transaction()
  public async CreateCertificate(ctx: Context, request: string): Promise<void> {
    const certificateRequest: CertificateRequest = JSON.parse(request);

    const exists = await this.CertificateExists(ctx, certificateRequest.id);
    if (exists) {
      throw new Error(`The asset ${certificateRequest.id} already exists`);
    }

    // Dynamically build the certificate object from the certificateRequest,
    // transforming the key names as necessary.
    // Transform the key from camelCase to StartCase (e.g., "id" to "ID")
    const certificate = Object.keys(certificateRequest).reduce((acc, key) => {
      const transformedKey = key
        .replace(/(?:^|\.?)([A-Z])/g, (x, y) => y.toUpperCase())
        .replace(/^./, (x) => x.toUpperCase());
      // To map the key from the certificateRequest to the certificate object
      acc[transformedKey] = certificateRequest[key];
      return acc;
    }, {});

    if (Object.keys(certificate).length === 0) {
      throw new Error(
        'Invalid certificate request, certificate was not mapped correctly'
      );
    }

    certificate['Status'] = 'Active';

    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      certificateRequest.id,
      Buffer.from(stringify(sortKeysRecursive(certificate)))
    );
  }

  // ValidateCertificate validates an existing certificate in the world state with provided parameters.
  @Transaction(false)
  @Returns('boolean')
  public async ValidateCertificate(
    ctx: Context,
    request: string
  ): Promise<boolean> {
    const certificateRequest: CertificateRequest = JSON.parse(request);

    const certificateJSON = await ctx.stub.getState(certificateRequest.id); // get the certificate from chaincode state
    if (!certificateJSON || certificateJSON.length === 0) {
      throw new Error('Certificate not found');
    }

    const certificate: Certificate = JSON.parse(certificateJSON.toString());
    const isValidated = compareCertificates(certificate, certificateRequest);

    return isValidated;
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  @Transaction()
  public async UpdateAsset(
    ctx: Context,
    id: string,
    color: string,
    size: number,
    owner: string,
    appraisedValue: number
  ): Promise<void> {
    const exists = await this.CertificateExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    // overwriting original asset with new asset
    const updatedAsset = {
      Id: id,
      Color: color,
      Size: size,
      Owner: owner,
      AppraisedValue: appraisedValue,
    };
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    return ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(updatedAsset)))
    );
  }

  // DeleteAsset deletes an given asset from the world state.
  @Transaction()
  public async DeleteAsset(ctx: Context, id: string): Promise<void> {
    const exists = await this.CertificateExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  // CertificateExists returns true when asset with given ID exists in world state.
  @Transaction(false)
  @Returns('boolean')
  public async CertificateExists(ctx: Context, id: string): Promise<boolean> {
    const certificateJSON = await ctx.stub.getState(id);
    return certificateJSON && certificateJSON.length > 0;
  }

  // GetAllCertificates returns all certificates found in the world state for the current client's MSPID.
  @Transaction(false)
  @Returns('string')
  public async GetAllCertificates(ctx: Context): Promise<string> {
    const currentClient = ctx.clientIdentity.getMSPID();
    const orgMapping = new Map<string, string>([
      ['Org1MSP', 'Cavall University'],
      ['Org2MSP', 'Truman College of Engineering'],
    ]);

    const institute = orgMapping.get(currentClient);

    if (!institute) {
      throw new Error(`No institute found for MSPID: ${currentClient}`);
    }

    const iterator = await ctx.stub.getStateByRange('', '');
    const allResults: Array<Certificate> = [];

    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        'utf8'
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }

      if (record.Institute && record.Institute === institute) {
        allResults.push(record);
      }

      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }
}
