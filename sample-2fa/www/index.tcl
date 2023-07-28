ad_proc keyuri {
	secret
	type
	accountName
       	{-counter ""}
       	{-step ""}
	{-digits "6"}
	{-algorithm "sha1"}
	{-issuer ""}
} {
	set params [list]
	lappend params secret=[ns_urlencode $secret]
	
	if { $type eq "hotp" } {
		lappend params counter=[ns_urlencode $counter]
	}
	
	if { $type eq "totp" } {
		lappend params period=[ns_urlencode $step]
	}

	if { $digits ne "" } {
		lappend params digits=$digits
	}

	if { $algorithm ne "" } {
		lappend params=[string toupper $algorithm]
	}

	set label [ns_urlencode $accountName]
	if { $issuer ne "" } {
		set label "${issuer}:${label}"
		lappend params issuer=[ns_urlencode $issuer]
	}
	set query [join $params "&"]
	return "otpauth://${type}/${label}?${query}"
}

ad_page_contract {
	@author Neophytos Demetriou (neophytos@gmail.com)
} {
	{totp_code ""}
}

set two_factor_auth_secret "abcdef"
set base32_encoded_secret [::tmfa::base32_encode $two_factor_auth_secret]
set uri [keyuri $base32_encoded_secret totp [xo::get_user_name [ad_conn user_id]] -step 30 -issuer OpenACS]
set svg [::tqrcodegen::encode_to_svg $uri]

ad_form -name totp_form -form {
	{totp_code:text,optional
	    {label "Code"}
	    {help_text "Enter the code you see in google authenticator"}
	}
} -after_submit {
	ad_returnredirect check?totp_code=$totp_code
	return
}

