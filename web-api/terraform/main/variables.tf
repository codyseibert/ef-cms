variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "zone_name" {
  type = string
}

variable "cognito_suffix" {
  type = string
}

variable "email_dmarc_policy" {
  type = string
}

variable "es_instance_count" {
  type    = string
  default = "1"
}

variable "es_instance_type" {
  type    = string
  default = "t2.small.elasticsearch"
}

variable "irs_superuser_email" {
  type = string
}

variable "deploying_color" {
  type    = string
  default = "green"
}

variable "blue_table_name" {
  type = string
}

variable "green_table_name" {
  type = string
}

variable "blue_elasticsearch_domain" {
  type = string
}

variable "green_elasticsearch_domain" {
  type = string
}

variable "destination_table" {
  type = string
}

variable "disable_emails" {
  type    = bool
  default = false
}

variable "es_volume_size" {
  type = number
}

variable "bounced_email_recipient" {
  type = string
}

variable "scanner_resource_uri" {
  type = string
}

variable "cognito_table_name" {
  type = string
}

variable "prod_env_account_id" {
  type = string
}

variable "lower_env_account_id" {
  type = string
}
