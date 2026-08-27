# Security Policy

## Supported Versions

Security fixes are applied to the latest release line.

| Version | Supported |
| --- | --- |
| 1.0.x | Yes |
| Earlier or unreleased snapshots | No guaranteed support |

## Reporting A Vulnerability

Report suspected vulnerabilities privately through the repository's [GitHub Security Advisories](https://github.com/siliang42/a-share-events-calendar/security/advisories/new) form. Include:

- the affected file, URL, or version;
- steps to reproduce or a minimal proof of concept;
- the expected and observed security impact;
- any known mitigations; and
- a safe way to contact you for follow-up.

Do not open a public issue, pull request, or discussion, and do not publicly disclose the vulnerability before remediation and a coordinated release. Public disclosure before users can apply a fix puts them at unnecessary risk and will not be accepted as a reporting method.

Maintainers will assess reproducibility, impact, and remediation options in the private advisory. Credit and disclosure timing will be coordinated with the reporter when practical.

## Scope

Relevant reports include unsafe handling of untrusted event data, link-scheme bypasses, cross-site scripting, dependency or workflow compromise, exposed credentials, and deployment configuration flaws. Factual corrections to calendar events are not security issues; use the correction issue form instead.
