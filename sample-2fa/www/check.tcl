ad_page_contract {
	@author Neophytos Demetriou (neophytos@gmail.com)
} {
	{totp_code ""}
}

set two_factor_auth_secret "abcdef"
set base32_encoded_secret [::tmfa::base32_encode $two_factor_auth_secret]
set current_totp_code [::tmfa::get_totp $base32_encoded_secret 6 30 SHA1]

if { $totp_code eq $current_totp_code } {
	set result "CORRECT"
} else {
	set result "INCORRECT"
}
